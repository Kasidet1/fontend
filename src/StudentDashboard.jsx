from pathlib import Path

source = Path("/mnt/data/ข้อความที่วาง (1)(2).txt")
output = Path("/mnt/data/StudentDashboard_fixed.jsx")

text = source.read_text(encoding="utf-8")

# 1) แก้ axios configuration ให้ชี้ backend root โดยตรง
old_config = """// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

// สร้างตัวแปรสำหรับยิง API ทั่วไป
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});"""

new_config = """// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

// สร้างตัวแปรสำหรับยิง API ทั่วไป
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});"""

if old_config not in text:
    raise ValueError("ไม่พบส่วน API configuration เดิม")
text = text.replace(old_config, new_config, 1)

# 2) แก้ profile API: /staff/me ไม่มีใน backend ปัจจุบัน
start = text.index("  useEffect(() => {\n    if (isLoggedIn)")
end = text.index("\n\n  const handleLogout", start)

new_effect = """  useEffect(() => {
    if (!isLoggedIn) return;

    // Backend ใช้ role: student / teacher / admin
    // Frontend แสดงผลเป็น: student / advisor / coordinator
    // admin ไม่มี /admin/me หรือ /staff/me ใน backend ปัจจุบัน
    // ดังนั้น coordinator จะใช้ username จากข้อมูล login แทน
    if (userRole === 'coordinator') {
      setFetchingUser(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setFetchingUser(true);

        let endpoint = '/student/me';

        if (userRole === 'advisor') {
          endpoint = '/teacher/me';
        }

        const response = await api.get(endpoint);

        console.log("Raw Profile Response:", response.data);

        if (Array.isArray(response.data)) {
          setProfileData(response.data[0] || null);
        } else if (response.data?.user) {
          setProfileData(
            Array.isArray(response.data.user)
              ? response.data.user[0]
              : response.data.user
          );
        } else {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, userRole]);"""

text = text[:start] + new_effect + text[end:]

# 3) ให้ login ใช้ role ที่ backend ส่งกลับมา ไม่ใช้ role ที่ผู้ใช้กดเลือกเอง
old_login_start = text.index("      const endpoint = '/login';")
old_login_end = text.index("\n      } else {", old_login_start) + len("\n      } else {")

new_login = """      // Backend มี endpoint /login เพียงตัวเดียว
      // และ backend จะเป็นผู้กำหนด role ที่แท้จริง
      const response = await api.post('/login', payload);

      const token =
        typeof response.data === 'string'
          ? response.data
          : response.data?.access_token;

      const backendRole =
        typeof response.data === 'object'
          ? response.data?.role
          : null;

      const loggedInUsername =
        typeof response.data === 'object'
          ? response.data?.username || username
          : username;

      // แปลง role จาก backend -> role ที่ UI เดิมใช้
      const frontendRoleMap = {
        student: 'student',
        teacher: 'advisor',
        admin: 'coordinator',
      };

      const frontendRole = frontendRoleMap[backendRole];

      if (token && frontendRole) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', frontendRole);
        localStorage.setItem('backendRole', backendRole);

        onLogin(frontendRole, loggedInUsername);
      } else if (token && !backendRole) {
        alert("เข้าสู่ระบบสำเร็จ แต่เซิร์ฟเวอร์ไม่ได้ส่งข้อมูลสิทธิ์ (role) กลับมา");
      } else if (token) {
        alert(`ไม่พบสิทธิ์ที่ระบบรองรับ: ${backendRole}`);
      } else {"""

text = text[:old_login_start] + new_login + text[old_login_end:]

# 4) ส่ง username จาก login มาแสดงได้ทันทีสำหรับ admin/coordinator
old_success = """  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };"""

new_success = """  const handleLoginSuccess = (role, username) => {
    setUserRole(role);
    setProfileData(username ? { username } : null);
    setIsLoggedIn(true);
  };"""

if old_success not in text:
    raise ValueError("ไม่พบ handleLoginSuccess เดิม")
text = text.replace(old_success, new_success, 1)

# 5) fallback ชื่อผู้ใช้ไม่ให้แสดงข้อความอาจารย์กับทุก role
old_display = """  const displayFullName = profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : fetchingUser ? 'กำลังโหลด...' : 'อาจารย์ประจำวิชา / เจ้าหน้าที่';"""

new_display = """  const displayFullName = profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : fetchingUser
      ? 'กำลังโหลด...'
      : profileData?.username || 'ผู้ใช้งานระบบ';"""

if old_display not in text:
    raise ValueError("ไม่พบ displayFullName เดิม")
text = text.replace(old_display, new_display, 1)

# 6) ลบคอมเมนต์เก่าที่ไม่ตรงกับโค้ดแล้ว
text = text.replace(
    """    } finally {
      // ซ่อมจุดนี้: ลบ loading(false) ออก เหลือเพียง setLoading(false)
      setLoading(false);
    }""",
    """    } finally {
      setLoading(false);
    }""",
    1
)

output.write_text(text, encoding="utf-8")

print(f"สร้างไฟล์เรียบร้อย: {output}")
print(f"จำนวนบรรทัด: {len(text.splitlines())}")
print("แก้หลัก ๆ: API root, /staff/me -> /teacher/me, ใช้ role จาก backend, login ผ่าน /login")
