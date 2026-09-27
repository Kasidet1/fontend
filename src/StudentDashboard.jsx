import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
LayoutDashboard,
Building2,
FileText,
Users,
User,
LogOut,
Search,
RefreshCw,
Pencil,
Save,
X,
CheckCircle2,
Clock3,
XCircle,
MapPin,
BriefcaseBusiness,
GraduationCap,
Phone,
Mail,
CalendarDays,
ClipboardList,
ShieldCheck,
Upload,
Eye,
Trash2,
Menu,
ChevronDown,
AlertCircle,
} from "lucide-react";

// ============================================================
// API
// ============================================================

const API_BASE_URL = "https://coop-backend-02.vercel.app";

const api = axios.create({
baseURL: API_BASE_URL,
headers: {
"Content-Type": "application/json",
},
});

api.interceptors.request.use(
(config) => {
const token = localStorage.getItem("token");

```
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

return config;
```

},
(error) => Promise.reject(error)
);

// ============================================================
// HELPERS
// ============================================================

const getErrorMessage = (error, fallback = "เกิดข้อผิดพลาด") => {
if (error?.response?.data?.detail) {
if (Array.isArray(error.response.data.detail)) {
return error.response.data.detail
.map((item) => item?.msg || "ข้อมูลไม่ถูกต้อง")
.join(", ");
}

```
return String(error.response.data.detail);
```

}

if (error?.response?.data?.message) {
return String(error.response.data.message);
}

if (error?.message) {
return error.message;
}

return fallback;
};

const normalizeArray = (data) => {
if (Array.isArray(data)) return data;

if (Array.isArray(data?.items)) return data.items;

if (Array.isArray(data?.data)) return data.data;

return [];
};

const formatDate = (value) => {
if (!value) return "-";

try {
return new Date(value).toLocaleDateString("th-TH", {
year: "numeric",
month: "long",
day: "numeric",
});
} catch {
return value;
}
};

const statusText = (status) => {
switch (String(status || "").toLowerCase()) {
case "approved":
return "อนุมัติแล้ว";

```
case "pending":
  return "รออนุมัติ";

case "rejected":
  return "ไม่อนุมัติ";

default:
  return status || "-";
```

}
};

const statusClass = (status) => {
switch (String(status || "").toLowerCase()) {
case "approved":
return "status-approved";

```
case "pending":
  return "status-pending";

case "rejected":
  return "status-rejected";

default:
  return "status-default";
```

}
};

// ============================================================
// GLOBAL STYLES
// ============================================================

const styles = `

* {
  box-sizing: border-box;
  }

body {
margin: 0;
font-family: 'Sarabun', Arial, sans-serif;
background: #f5f6f8;
color: #202124;
}

button,
input,
select,
textarea {
font-family: inherit;
}

button {
cursor: pointer;
}

.app-shell {
min-height: 100vh;
display: flex;
background: #f5f6f8;
}

/* SIDEBAR */

.sidebar {
width: 260px;
min-height: 100vh;
background: linear-gradient(180deg, #800000 0%, #4a0000 100%);
color: white;
position: fixed;
left: 0;
top: 0;
bottom: 0;
z-index: 100;
display: flex;
flex-direction: column;
}

.brand {
padding: 26px 22px;
border-bottom: 1px solid rgba(255,255,255,.15);
}

.brand-title {
font-size: 22px;
font-weight: 700;
}

.brand-subtitle {
margin-top: 3px;
font-size: 13px;
opacity: .75;
}

.sidebar-menu {
padding: 20px 12px;
flex: 1;
}

.menu-title {
font-size: 12px;
opacity: .6;
padding: 0 12px 10px;
}

.menu-button {
width: 100%;
border: 0;
background: transparent;
color: rgba(255,255,255,.82);
display: flex;
align-items: center;
gap: 12px;
padding: 12px 14px;
border-radius: 10px;
margin-bottom: 5px;
text-align: left;
font-size: 15px;
transition: .2s;
}

.menu-button:hover {
background: rgba(255,255,255,.10);
color: white;
}

.menu-button.active {
background: rgba(255,255,255,.16);
color: white;
font-weight: 600;
}

.sidebar-footer {
padding: 16px;
border-top: 1px solid rgba(255,255,255,.15);
}

.user-mini {
display: flex;
align-items: center;
gap: 10px;
}

.user-mini-avatar {
width: 38px;
height: 38px;
border-radius: 50%;
background: rgba(255,255,255,.16);
display: flex;
align-items: center;
justify-content: center;
}

.user-mini-info {
min-width: 0;
flex: 1;
}

.user-mini-name {
font-size: 14px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.user-mini-role {
font-size: 12px;
opacity: .65;
}

.logout-button {
width: 100%;
margin-top: 13px;
border: 1px solid rgba(255,255,255,.2);
background: transparent;
color: white;
border-radius: 8px;
padding: 9px;
display: flex;
justify-content: center;
align-items: center;
gap: 8px;
}

/* MAIN */

.main-area {
margin-left: 260px;
width: calc(100% - 260px);
min-height: 100vh;
}

.topbar {
height: 70px;
background: white;
border-bottom: 1px solid #e6e7e9;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 28px;
position: sticky;
top: 0;
z-index: 50;
}

.topbar-left {
display: flex;
align-items: center;
gap: 12px;
}

.mobile-menu-button {
display: none;
border: 0;
background: transparent;
}

.page-title {
font-size: 21px;
font-weight: 700;
}

.page-subtitle {
font-size: 13px;
color: #777;
}

.top-user {
display: flex;
align-items: center;
gap: 10px;
}

.top-avatar {
width: 40px;
height: 40px;
border-radius: 50%;
background: #f0e1e1;
color: #800000;
display: flex;
align-items: center;
justify-content: center;
}

.content {
padding: 28px;
max-width: 1600px;
margin: auto;
}

/* CARDS */

.stats-grid {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 18px;
margin-bottom: 25px;
}

.stat-card {
background: white;
border: 1px solid #e8e8e8;
border-radius: 14px;
padding: 20px;
display: flex;
align-items: center;
justify-content: space-between;
}

.stat-left {
display: flex;
flex-direction: column;
gap: 5px;
}

.stat-label {
color: #777;
font-size: 14px;
}

.stat-number {
font-size: 30px;
font-weight: 700;
}

.stat-icon {
width: 48px;
height: 48px;
border-radius: 12px;
background: #f5e9e9;
color: #800000;
display: flex;
align-items: center;
justify-content: center;
}

/* PANELS */

.panel {
background: white;
border: 1px solid #e7e7e7;
border-radius: 14px;
padding: 22px;
margin-bottom: 20px;
}

.panel-header {
display: flex;
justify-content: space-between;
align-items: center;
gap: 15px;
margin-bottom: 20px;
}

.panel-title {
font-size: 19px;
font-weight: 700;
}

.panel-description {
color: #777;
font-size: 13px;
margin-top: 3px;
}

/* BUTTONS */

.primary-button,
.secondary-button,
.danger-button {
border-radius: 9px;
padding: 10px 15px;
border: 1px solid transparent;
display: inline-flex;
align-items: center;
justify-content: center;
gap: 8px;
font-size: 14px;
}

.primary-button {
background: #800000;
color: white;
}

.primary-button:hover {
background: #650000;
}

.secondary-button {
background: white;
color: #444;
border-color: #dcdcdc;
}

.secondary-button:hover {
background: #f7f7f7;
}

.danger-button {
background: #fff0f0;
color: #b42318;
border-color: #ffd1d1;
}

/* FORMS */

.form-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 17px;
}

.form-group {
display: flex;
flex-direction: column;
gap: 7px;
}

.form-group.full {
grid-column: 1 / -1;
}

.form-label {
font-size: 14px;
font-weight: 600;
}

.form-input,
.form-select,
.form-textarea {
width: 100%;
border: 1px solid #d9d9d9;
border-radius: 9px;
padding: 11px 13px;
outline: none;
background: white;
font-size: 14px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
border-color: #800000;
box-shadow: 0 0 0 3px rgba(128,0,0,.08);
}

.form-textarea {
min-height: 100px;
resize: vertical;
}

.form-actions {
display: flex;
gap: 10px;
margin-top: 20px;
}

/* SEARCH */

.search-row {
display: flex;
gap: 10px;
margin-bottom: 18px;
flex-wrap: wrap;
}

.search-box {
flex: 1;
min-width: 220px;
position: relative;
}

.search-box svg {
position: absolute;
left: 12px;
top: 50%;
transform: translateY(-50%);
color: #888;
}

.search-box input {
padding-left: 40px;
}

.filter-select {
min-width: 160px;
}

/* COMPANY */

.company-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 18px;
}

.company-card {
border: 1px solid #e5e5e5;
border-radius: 13px;
padding: 18px;
background: white;
transition: .2s;
}

.company-card:hover {
border-color: #c7a1a1;
box-shadow: 0 4px 16px rgba(0,0,0,.05);
}

.company-name {
font-size: 17px;
font-weight: 700;
margin-bottom: 12px;
}

.company-line {
display: flex;
gap: 8px;
color: #666;
font-size: 13px;
margin: 8px 0;
}

.company-line svg {
color: #800000;
flex-shrink: 0;
}

.company-tags {
display: flex;
gap: 6px;
flex-wrap: wrap;
margin-top: 14px;
}

.company-tag {
padding: 4px 8px;
border-radius: 20px;
background: #f6eeee;
color: #800000;
font-size: 12px;
}

/* TABLE */

.table-wrap {
overflow-x: auto;
}

.data-table {
width: 100%;
border-collapse: collapse;
min-width: 700px;
}

.data-table th {
background: #fafafa;
text-align: left;
font-size: 13px;
color: #666;
font-weight: 600;
padding: 13px 12px;
border-bottom: 1px solid #e5e5e5;
}

.data-table td {
padding: 14px 12px;
border-bottom: 1px solid #eeeeee;
font-size: 14px;
}

.data-table tr:last-child td {
border-bottom: 0;
}

/* STATUS */

.status {
display: inline-flex;
align-items: center;
gap: 5px;
padding: 5px 9px;
border-radius: 20px;
font-size: 12px;
font-weight: 600;
}

.status-approved {
background: #e9f8ef;
color: #16794c;
}

.status-pending {
background: #fff5dd;
color: #9a6700;
}

.status-rejected {
background: #ffeded;
color: #b42318;
}

.status-default {
background: #eee;
color: #666;
}

/* PROFILE */

.profile-header {
background: linear-gradient(135deg, #800000, #4a0000);
color: white;
border-radius: 14px;
padding: 25px;
display: flex;
align-items: center;
gap: 18px;
margin-bottom: 20px;
}

.profile-avatar {
width: 75px;
height: 75px;
border-radius: 50%;
background: rgba(255,255,255,.18);
display: flex;
align-items: center;
justify-content: center;
font-size: 28px;
font-weight: 700;
}

.profile-name {
font-size: 23px;
font-weight: 700;
}

.profile-role {
opacity: .75;
font-size: 14px;
}

/* TEACHER */

.teacher-card {
border: 1px solid #e4e4e4;
border-radius: 13px;
padding: 20px;
}

.teacher-name {
font-size: 18px;
font-weight: 700;
}

.teacher-detail {
color: #666;
font-size: 14px;
margin-top: 8px;
}

/* EMPTY */

.empty-state {
text-align: center;
padding: 55px 20px;
color: #888;
}

.empty-state svg {
margin-bottom: 10px;
opacity: .55;
}

/* ALERT */

.alert-box {
border-radius: 10px;
padding: 12px 14px;
display: flex;
align-items: flex-start;
gap: 9px;
margin-bottom: 18px;
font-size: 14px;
}

.alert-error {
background: #fff0f0;
border: 1px solid #ffd0d0;
color: #a51d1d;
}

.alert-success {
background: #edf9f2;
border: 1px solid #c9ecd7;
color: #176c40;
}

/* LOADING */

.loading {
padding: 50px;
text-align: center;
color: #777;
}

.spinner {
width: 30px;
height: 30px;
border: 3px solid #eee;
border-top-color: #800000;
border-radius: 50%;
animation: spin 1s linear infinite;
margin: 0 auto 12px;
}

@keyframes spin {
to {
transform: rotate(360deg);
}
}

/* LOGIN */

.login-page {
min-height: 100vh;
background: linear-gradient(135deg, #800000, #280000);
display: flex;
align-items: center;
justify-content: center;
padding: 20px;
}

.login-card {
width: 100%;
max-width: 430px;
background: white;
border-radius: 18px;
padding: 35px;
box-shadow: 0 20px 60px rgba(0,0,0,.25);
}

.login-logo {
width: 62px;
height: 62px;
border-radius: 15px;
background: #800000;
color: white;
display: flex;
align-items: center;
justify-content: center;
margin: 0 auto 15px;
}

.login-title {
text-align: center;
font-size: 25px;
font-weight: 700;
}

.login-subtitle {
text-align: center;
color: #777;
font-size: 14px;
margin: 5px 0 25px;
}

.login-form {
display: flex;
flex-direction: column;
gap: 15px;
}

.login-button {
width: 100%;
border: 0;
border-radius: 9px;
padding: 13px;
background: #800000;
color: white;
font-size: 16px;
font-weight: 600;
margin-top: 5px;
}

.login-button:disabled {
opacity: .6;
cursor: not-allowed;
}

/* MOBILE */

@media (max-width: 1100px) {
.company-grid {
grid-template-columns: repeat(2, 1fr);
}

.stats-grid {
grid-template-columns: repeat(2, 1fr);
}
}

@media (max-width: 800px) {
.sidebar {
transform: translateX(-100%);
transition: .25s;
}

.sidebar.open {
transform: translateX(0);
}

.main-area {
margin-left: 0;
width: 100%;
}

.mobile-menu-button {
display: block;
}

.content {
padding: 18px;
}

.form-grid {
grid-template-columns: 1fr;
}

.form-group.full {
grid-column: auto;
}

.company-grid {
grid-template-columns: 1fr;
}
}

@media (max-width: 550px) {
.stats-grid {
grid-template-columns: 1fr;
}

.top-user {
display: none;
}

.panel {
padding: 16px;
}

.profile-header {
padding: 18px;
}

.profile-name {
font-size: 19px;
}
}
`;

// ============================================================
// LOGIN PAGE
// ============================================================

function LoginPage({ onLogin }) {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [selectedRole, setSelectedRole] = useState("student");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (event) => {
event.preventDefault();

```
setError("");

if (!username.trim() || !password.trim()) {
  setError("กรุณากรอก Username และ Password");
  return;
}

try {
  setLoading(true);

  const response = await api.post("/login", {
    username: username.trim(),
    password,
  });

  const data = response.data || {};

  const token = data.access_token || data.token;

  if (!token) {
    throw new Error("Backend ไม่ได้ส่ง access token กลับมา");
  }

  const backendRole = data.role;

  if (!backendRole) {
    throw new Error("Backend ไม่ได้ส่ง role กลับมา");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("username", data.username || username.trim());
  localStorage.setItem("backendRole", backendRole);

  let frontendRole = "student";

  if (backendRole === "admin") {
    frontendRole = "coordinator";
  } else if (backendRole === "teacher") {
    frontendRole = "advisor";
  } else {
    frontendRole = "student";
  }

  localStorage.setItem("userRole", frontendRole);

  onLogin(frontendRole, data.username || username.trim());
} catch (error) {
  setError(getErrorMessage(error, "เข้าสู่ระบบไม่สำเร็จ"));
} finally {
  setLoading(false);
}
```

};

return ( <div className="login-page"> <div className="login-card"> <div className="login-logo"> <GraduationCap size={31} /> </div>

```
    <div className="login-title">
      Coop Education
    </div>

    <div className="login-subtitle">
      ระบบจัดการสหกิจศึกษา
    </div>

    {error && (
      <div className="alert-box alert-error">
        <AlertCircle size={18} />
        <div>{error}</div>
      </div>
    )}

    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          Username
        </label>

        <input
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="กรอก Username"
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Password
        </label>

        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอก Password"
          autoComplete="current-password"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          ประเภทผู้ใช้งาน
        </label>

        <select
          className="form-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="student">นักศึกษา</option>
          <option value="advisor">อาจารย์</option>
          <option value="coordinator">ผู้ประสานงาน / Admin</option>
        </select>
      </div>

      <button
        className="login-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>

    <div
      style={{
        marginTop: 18,
        fontSize: 12,
        color: "#999",
        textAlign: "center",
      }}
    >
      สิทธิ์การใช้งานจะอ้างอิงจาก Role ที่ Backend ส่งกลับมา
    </div>
  </div>
</div>
```

);
}

// ============================================================
// STUDENT DASHBOARD
// ============================================================

function StudentOverview({
profile,
applications,
companies,
teacher,
loading,
onRefresh,
onNavigate,
}) {
const studentApplications = applications.filter(
(application) =>
Number(application.student_id) === Number(profile?.id)
);

const approved = studentApplications.filter(
(item) => item.status === "approved"
).length;

const pending = studentApplications.filter(
(item) => item.status === "pending"
).length;

const rejected = studentApplications.filter(
(item) => item.status === "rejected"
).length;

return (
<> <div className="stats-grid"> <div className="stat-card"> <div className="stat-left"> <div className="stat-label">สมัครทั้งหมด</div> <div className="stat-number">
{studentApplications.length} </div> </div>

```
      <div className="stat-icon">
        <FileText size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">รออนุมัติ</div>
        <div className="stat-number">
          {pending}
        </div>
      </div>

      <div className="stat-icon">
        <Clock3 size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">อนุมัติแล้ว</div>
        <div className="stat-number">
          {approved}
        </div>
      </div>

      <div className="stat-icon">
        <CheckCircle2 size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">ไม่อนุมัติ</div>
        <div className="stat-number">
          {rejected}
        </div>
      </div>

      <div className="stat-icon">
        <XCircle size={23} />
      </div>
    </div>
  </div>

  <div className="panel">
    <div className="panel-header">
      <div>
        <div className="panel-title">
          ข้อมูลนักศึกษา
        </div>

        <div className="panel-description">
          ข้อมูลจาก Student Profile
        </div>
      </div>

      <button
        className="secondary-button"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw size={16} />
        รีเฟรช
      </button>
    </div>

    <div className="profile-header">
      <div className="profile-avatar">
        {(profile?.first_name || "S").charAt(0)}
      </div>

      <div>
        <div className="profile-name">
          {profile?.first_name || "-"}{" "}
          {profile?.last_name || ""}
        </div>

        <div className="profile-role">
          รหัสนักศึกษา: {profile?.student_id || "-"}
        </div>
      </div>
    </div>

    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">คณะ</label>
        <div>{profile?.faculty || "-"}</div>
      </div>

      <div className="form-group">
        <label className="form-label">สาขา</label>
        <div>{profile?.major || "-"}</div>
      </div>

      <div className="form-group">
        <label className="form-label">อีเมล</label>
        <div>{profile?.email || "-"}</div>
      </div>

      <div className="form-group">
        <label className="form-label">เบอร์โทรศัพท์</label>
        <div>{profile?.phone || "-"}</div>
      </div>

      <div className="form-group">
        <label className="form-label">ภาคการศึกษา</label>
        <div>{profile?.semester || "-"}</div>
      </div>
    </div>
  </div>

  <div className="panel">
    <div className="panel-header">
      <div>
        <div className="panel-title">
          อาจารย์ที่ปรึกษา / ผู้ดูแล
        </div>

        <div className="panel-description">
          ข้อมูลจาก /student/teacher
        </div>
      </div>
    </div>

    {teacher.length === 0 ? (
      <div className="empty-state">
        <Users size={40} />
        <div>ยังไม่พบข้อมูลอาจารย์ผู้ดูแล</div>
      </div>
    ) : (
      <div className="company-grid">
        {teacher.map((item, index) => (
          <div className="teacher-card" key={item.id || index}>
            <div className="teacher-name">
              {item.teacher_name ||
                item.name ||
                `${item.first_name || ""} ${item.last_name || ""}`}
            </div>

            {item.company_name && (
              <div className="teacher-detail">
                บริษัท: {item.company_name}
              </div>
            )}

            {item.department && (
              <div className="teacher-detail">
                หน่วยงาน: {item.department}
              </div>
            )}

            {item.industry && (
              <div className="teacher-detail">
                อุตสาหกรรม: {item.industry}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    <div style={{ marginTop: 18 }}>
      <button
        className="primary-button"
        onClick={() => onNavigate("company")}
      >
        <Building2 size={17} />
        ดูสถานประกอบการ
      </button>
    </div>
  </div>
</>
```

);
}

// ============================================================
// STUDENT PROFILE
// ============================================================

function StudentProfile({
profile,
onSaved,
}) {
const [form, setForm] = useState({
first_name: "",
last_name: "",
faculty: "",
major: "",
username: "",
phone: "",
semester: "",
});

const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

useEffect(() => {
if (!profile) return;

```
setForm({
  first_name: profile.first_name || "",
  last_name: profile.last_name || "",
  faculty: profile.faculty || "",
  major: profile.major || "",
  username: profile.username || profile.student_id || "",
  phone: profile.phone || "",
  semester: profile.semester || "",
});
```

}, [profile]);

const handleChange = (field, value) => {
setForm((previous) => ({
...previous,
[field]: value,
}));
};

const save = async () => {
try {
setSaving(true);
setMessage("");
setError("");

```
  const response = await api.put("/student/me", form);

  setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");

  if (onSaved) {
    onSaved(response.data);
  }
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถบันทึกข้อมูลนักศึกษาได้"
    )
  );
} finally {
  setSaving(false);
}
```

};

return ( <div className="panel"> <div className="panel-header"> <div> <div className="panel-title">
แก้ไขข้อมูลนักศึกษา </div>

```
      <div className="panel-description">
        PUT /student/me
      </div>
    </div>

    <User size={22} color="#800000" />
  </div>

  {message && (
    <div className="alert-box alert-success">
      <CheckCircle2 size={18} />
      {message}
    </div>
  )}

  {error && (
    <div className="alert-box alert-error">
      <AlertCircle size={18} />
      {error}
    </div>
  )}

  <div className="form-grid">
    <div className="form-group">
      <label className="form-label">ชื่อ</label>
      <input
        className="form-input"
        value={form.first_name}
        onChange={(e) =>
          handleChange("first_name", e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">นามสกุล</label>
      <input
        className="form-input"
        value={form.last_name}
        onChange={(e) =>
          handleChange("last_name", e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">คณะ</label>
      <input
        className="form-input"
        value={form.faculty}
        onChange={(e) =>
          handleChange("faculty", e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">สาขา</label>
      <input
        className="form-input"
        value={form.major}
        onChange={(e) =>
          handleChange("major", e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">Username</label>
      <input
        className="form-input"
        value={form.username}
        onChange={(e) =>
          handleChange("username", e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">เบอร์โทรศัพท์</label>
      <input
        className="form-input"
        value={form.phone}
        onChange={(e) =>
          handleChange("phone", e.target.value)
        }
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        ภาคการศึกษา
      </label>

      <input
        className="form-input"
        value={form.semester}
        onChange={(e) =>
          handleChange("semester", e.target.value)
        }
      />
    </div>
  </div>

  <div className="form-actions">
    <button
      className="primary-button"
      onClick={save}
      disabled={saving}
    >
      <Save size={17} />
      {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
    </button>
  </div>
</div>
```

);
}

// ============================================================
// COMPANY MANAGEMENT
// ============================================================

function CompanyManagement({
role,
companies,
loading,
onRefresh,
onApply,
}) {
const [search, setSearch] = useState("");
const [county, setCounty] = useState("");
const [industry, setIndustry] = useState("");
const [allowance, setAllowance] = useState("");
const [accommodation, setAccommodation] = useState("");
const [shuttle, setShuttle] = useState("");

const industries = useMemo(() => {
return [
...new Set(
companies
.map((item) => item.industry)
.filter(Boolean)
),
];
}, [companies]);

const counties = useMemo(() => {
return [
...new Set(
companies
.map((item) => item.county)
.filter(Boolean)
),
];
}, [companies]);

const filteredCompanies = useMemo(() => {
return companies.filter((company) => {
const searchValue = search.trim().toLowerCase();

```
  const matchSearch =
    !searchValue ||
    String(company.company_name || "")
      .toLowerCase()
      .includes(searchValue) ||
    String(company.address || "")
      .toLowerCase()
      .includes(searchValue) ||
    String(company.county || "")
      .toLowerCase()
      .includes(searchValue) ||
    String(company.industry || "")
      .toLowerCase()
      .includes(searchValue);

  const matchCounty =
    !county || company.county === county;

  const matchIndustry =
    !industry || company.industry === industry;

  const matchAllowance =
    !allowance || company.allowance === allowance;

  const matchAccommodation =
    !accommodation ||
    company.accommodation === accommodation;

  const matchShuttle =
    !shuttle || company.shuttle === shuttle;

  return (
    matchSearch &&
    matchCounty &&
    matchIndustry &&
    matchAllowance &&
    matchAccommodation &&
    matchShuttle
  );
});
```

}, [
companies,
search,
county,
industry,
allowance,
accommodation,
shuttle,
]);

return ( <div className="panel"> <div className="panel-header"> <div> <div className="panel-title">
สถานประกอบการ </div>

```
      <div className="panel-description">
        ข้อมูลจาก GET /companies
      </div>
    </div>

    <button
      className="secondary-button"
      onClick={onRefresh}
      disabled={loading}
    >
      <RefreshCw size={16} />
      รีเฟรช
    </button>
  </div>

  <div className="search-row">
    <div className="search-box">
      <Search size={17} />

      <input
        className="form-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ค้นหาชื่อบริษัท ที่อยู่ อุตสาหกรรม..."
      />
    </div>

    <select
      className="form-select filter-select"
      value={county}
      onChange={(e) => setCounty(e.target.value)}
    >
      <option value="">ทุกพื้นที่</option>

      {counties.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>

    <select
      className="form-select filter-select"
      value={industry}
      onChange={(e) => setIndustry(e.target.value)}
    >
      <option value="">ทุกอุตสาหกรรม</option>

      {industries.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>

    <select
      className="form-select filter-select"
      value={allowance}
      onChange={(e) => setAllowance(e.target.value)}
    >
      <option value="">เบี้ยเลี้ยงทั้งหมด</option>
      <option value="มี">มี</option>
      <option value="ไม่มี">ไม่มี</option>
    </select>

    <select
      className="form-select filter-select"
      value={accommodation}
      onChange={(e) =>
        setAccommodation(e.target.value)
      }
    >
      <option value="">ที่พักทั้งหมด</option>
      <option value="มี">มี</option>
      <option value="ไม่มี">ไม่มี</option>
    </select>

    <select
      className="form-select filter-select"
      value={shuttle}
      onChange={(e) => setShuttle(e.target.value)}
    >
      <option value="">รถรับส่งทั้งหมด</option>
      <option value="มี">มี</option>
      <option value="ไม่มี">ไม่มี</option>
    </select>
  </div>

  {loading ? (
    <div className="loading">
      <div className="spinner" />
      กำลังโหลดข้อมูลบริษัท...
    </div>
  ) : filteredCompanies.length === 0 ? (
    <div className="empty-state">
      <Building2 size={42} />
      <div>ไม่พบสถานประกอบการ</div>
    </div>
  ) : (
    <div className="company-grid">
      {filteredCompanies.map((company) => (
        <div
          className="company-card"
          key={company.id}
        >
          <div className="company-name">
            {company.company_name || "-"}
          </div>

          <div className="company-line">
            <MapPin size={16} />
            <span>
              {company.address || "-"}
            </span>
          </div>

          <div className="company-line">
            <BriefcaseBusiness size={16} />
            <span>
              {company.industry || "-"}
            </span>
          </div>

          <div className="company-line">
            <MapPin size={16} />
            <span>
              {company.county || "-"}
            </span>
          </div>

          <div className="company-tags">
            <span className="company-tag">
              เบี้ยเลี้ยง: {company.allowance || "-"}
            </span>

            <span className="company-tag">
              ที่พัก: {company.accommodation || "-"}
            </span>

            <span className="company-tag">
              รถรับส่ง: {company.shuttle || "-"}
            </span>
          </div>

          {role === "student" && (
            <button
              className="primary-button"
              style={{
                width: "100%",
                marginTop: 15,
              }}
              onClick={() => onApply(company)}
            >
              <FileText size={16} />
              สมัครสถานประกอบการ
            </button>
          )}
        </div>
      ))}
    </div>
  )}
</div>
```

);
}

// ============================================================
// APPLICATIONS
// ============================================================

function ApplicationManagement({
role,
applications,
students,
companies,
loading,
onRefresh,
onApprove,
onReject,
}) {
const studentMap = useMemo(() => {
const map = {};

```
students.forEach((student) => {
  map[student.id] = student;
});

return map;
```

}, [students]);

const companyMap = useMemo(() => {
const map = {};

```
companies.forEach((company) => {
  map[company.id] = company;
});

return map;
```

}, [companies]);

const displayApplications = applications;

return ( <div className="panel"> <div className="panel-header"> <div> <div className="panel-title">
รายการสมัครสถานประกอบการ </div>

```
      <div className="panel-description">
        ข้อมูลจาก GET /applications
      </div>
    </div>

    <button
      className="secondary-button"
      onClick={onRefresh}
      disabled={loading}
    >
      <RefreshCw size={16} />
      รีเฟรช
    </button>
  </div>

  {loading ? (
    <div className="loading">
      <div className="spinner" />
      กำลังโหลดใบสมัคร...
    </div>
  ) : displayApplications.length === 0 ? (
    <div className="empty-state">
      <FileText size={42} />
      <div>ยังไม่มีรายการสมัคร</div>
    </div>
  ) : (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>นักศึกษา</th>
            <th>สถานประกอบการ</th>
            <th>สถานะ</th>
            {role === "coordinator" && (
              <th>จัดการ</th>
            )}
          </tr>
        </thead>

        <tbody>
          {displayApplications.map((application) => {
            const student =
              studentMap[application.student_id];

            const company =
              companyMap[application.company_id];

            return (
              <tr key={application.id}>
                <td>
                  #{application.id}
                </td>

                <td>
                  {student ? (
                    <>
                      <div style={{ fontWeight: 600 }}>
                        {student.first_name}{" "}
                        {student.last_name}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "#777",
                        }}
                      >
                        {student.student_id}
                      </div>
                    </>
                  ) : (
                    `Student ID: ${application.student_id}`
                  )}
                </td>

                <td>
                  {company?.company_name ||
                    `Company ID: ${application.company_id}`}
                </td>

                <td>
                  <span
                    className={`status ${statusClass(
                      application.status
                    )}`}
                  >
                    {statusText(
                      application.status
                    )}
                  </span>
                </td>

                {role === "coordinator" && (
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                      }}
                    >
                      {application.status !==
                        "approved" && (
                        <button
                          className="primary-button"
                          onClick={() =>
                            onApprove(application.id)
                          }
                        >
                          <CheckCircle2 size={15} />
                          อนุมัติ
                        </button>
                      )}

                      {application.status !==
                        "rejected" && (
                        <button
                          className="danger-button"
                          onClick={() =>
                            onReject(application.id)
                          }
                        >
                          <XCircle size={15} />
                          ปฏิเสธ
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
```

);
}

// ============================================================
// TEACHER PAGE
// ============================================================

function TeacherDashboard({
teacherProfile,
teacherStudents,
teacherDashboard,
teacherSupervisions,
onRefresh,
}) {
const [editing, setEditing] = useState(false);

const [form, setForm] = useState({
username: "",
rank: "",
first_name: "",
last_name: "",
email: "",
role: "teacher",
});

const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

useEffect(() => {
if (!teacherProfile) return;

```
setForm({
  username: teacherProfile.username || "",
  rank: teacherProfile.rank || "",
  first_name: teacherProfile.first_name || "",
  last_name: teacherProfile.last_name || "",
  email: teacherProfile.email || "",
  role: teacherProfile.role || "teacher",
});
```

}, [teacherProfile]);

const saveProfile = async () => {
try {
setSaving(true);
setMessage("");
setError("");

```
  await api.put("/teacher/me", form);

  setMessage("บันทึกข้อมูลอาจารย์เรียบร้อยแล้ว");
  setEditing(false);

  onRefresh();
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถบันทึกข้อมูลอาจารย์ได้"
    )
  );
} finally {
  setSaving(false);
}
```

};

return (
<> <div className="stats-grid"> <div className="stat-card"> <div className="stat-left"> <div className="stat-label">
นักศึกษาที่รับผิดชอบ </div>

```
        <div className="stat-number">
          {teacherDashboard?.students ??
            teacherStudents.length ??
            0}
        </div>
      </div>

      <div className="stat-icon">
        <Users size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">
          จำนวนการนิเทศ
        </div>

        <div className="stat-number">
          {teacherDashboard?.supervision_count ??
            teacherSupervisions.length}
        </div>
      </div>

      <div className="stat-icon">
        <ClipboardList size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">
          นักศึกษาในรายการ
        </div>

        <div className="stat-number">
          {teacherStudents.length}
        </div>
      </div>

      <div className="stat-icon">
        <GraduationCap size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">
          สถานะระบบ
        </div>

        <div className="stat-number">
          ✓
        </div>
      </div>

      <div className="stat-icon">
        <ShieldCheck size={23} />
      </div>
    </div>
  </div>

  {message && (
    <div className="alert-box alert-success">
      <CheckCircle2 size={18} />
      {message}
    </div>
  )}

  {error && (
    <div className="alert-box alert-error">
      <AlertCircle size={18} />
      {error}
    </div>
  )}

  <div className="panel">
    <div className="panel-header">
      <div>
        <div className="panel-title">
          ข้อมูลอาจารย์
        </div>

        <div className="panel-description">
          GET /teacher/me และ PUT /teacher/me
        </div>
      </div>

      {!editing ? (
        <button
          className="secondary-button"
          onClick={() => setEditing(true)}
        >
          <Pencil size={16} />
          แก้ไข
        </button>
      ) : (
        <button
          className="secondary-button"
          onClick={() => setEditing(false)}
        >
          <X size={16} />
          ยกเลิก
        </button>
      )}
    </div>

    {!editing ? (
      <div className="profile-header">
        <div className="profile-avatar">
          {(teacherProfile?.first_name || "T").charAt(0)}
        </div>

        <div>
          <div className="profile-name">
            {teacherProfile?.rank || ""}{" "}
            {teacherProfile?.first_name || "-"}{" "}
            {teacherProfile?.last_name || ""}
          </div>

          <div className="profile-role">
            Username:{" "}
            {teacherProfile?.username || "-"}
          </div>

          <div className="profile-role">
            Email: {teacherProfile?.email || "-"}
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              Username
            </label>

            <input
              className="form-input"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              คำนำหน้า / ตำแหน่ง
            </label>

            <input
              className="form-input"
              value={form.rank}
              onChange={(e) =>
                setForm({
                  ...form,
                  rank: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              ชื่อ
            </label>

            <input
              className="form-input"
              value={form.first_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  first_name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              นามสกุล
            </label>

            <input
              className="form-input"
              value={form.last_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  last_name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email
            </label>

            <input
              className="form-input"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            onClick={saveProfile}
            disabled={saving}
          >
            <Save size={16} />
            {saving
              ? "กำลังบันทึก..."
              : "บันทึกข้อมูล"}
          </button>
        </div>
      </>
    )}
  </div>

  <div className="panel">
    <div className="panel-header">
      <div>
        <div className="panel-title">
          นักศึกษาที่รับผิดชอบ
        </div>

        <div className="panel-description">
          GET /teacher/students
        </div>
      </div>
    </div>

    {teacherStudents.length === 0 ? (
      <div className="empty-state">
        <Users size={40} />
        <div>
          ไม่พบรายชื่อนักศึกษา
        </div>
      </div>
    ) : (
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>รหัสนักศึกษา</th>
              <th>ชื่อ</th>
              <th>บริษัท</th>
              <th>แผนก</th>
              <th>อุตสาหกรรม</th>
              <th>รูปแบบงาน</th>
            </tr>
          </thead>

          <tbody>
            {teacherStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.student_id}</td>
                <td>{student.student_name}</td>
                <td>{student.company_name}</td>
                <td>{student.department || "-"}</td>
                <td>{student.industry || "-"}</td>
                <td>{student.work_modes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>

  <div className="panel">
    <div className="panel-header">
      <div>
        <div className="panel-title">
          ประวัติการนิเทศ
        </div>

        <div className="panel-description">
          GET /teacher/supervisions
        </div>
      </div>
    </div>

    {teacherSupervisions.length === 0 ? (
      <div className="empty-state">
        <ClipboardList size={40} />
        <div>
          ยังไม่มีข้อมูลการนิเทศ
        </div>
      </div>
    ) : (
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>นักศึกษา</th>
              <th>บริษัท</th>
              <th>อุตสาหกรรม</th>
              <th>ประเภท</th>
              <th>สถานะ</th>
            </tr>
          </thead>

          <tbody>
            {teacherSupervisions.map(
              (supervision, index) => (
                <tr key={index}>
                  <td>
                    {formatDate(
                      supervision.date
                    )}
                  </td>

                  <td>
                    {supervision.student_id}
                    <br />
                    {supervision.student_first_name}{" "}
                    {supervision.student_last_name}
                  </td>

                  <td>
                    {supervision.company_name}
                  </td>

                  <td>
                    {supervision.industry}
                  </td>

                  <td>
                    {supervision.type}
                  </td>

                  <td>
                    <span
                      className={`status ${statusClass(
                        supervision.status
                      )}`}
                    >
                      {statusText(
                        supervision.status
                      )}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
</>
```

);
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboard({
dashboard,
applications,
students,
companies,
loading,
onRefresh,
}) {
return (
<> <div className="stats-grid"> <div className="stat-card"> <div className="stat-left"> <div className="stat-label">
นักศึกษาทั้งหมด </div>

```
        <div className="stat-number">
          {dashboard?.students ?? students.length}
        </div>
      </div>

      <div className="stat-icon">
        <Users size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">
          สถานประกอบการ
        </div>

        <div className="stat-number">
          {dashboard?.companies ??
            companies.length}
        </div>
      </div>

      <div className="stat-icon">
        <Building2 size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">
          ใบสมัคร
        </div>

        <div className="stat-number">
          {dashboard?.applications ??
            applications.length}
        </div>
      </div>

      <div className="stat-icon">
        <FileText size={23} />
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">
          การนิเทศ
        </div>

        <div className="stat-number">
          {dashboard?.supervisions ?? 0}
        </div>
      </div>

      <div className="stat-icon">
        <ClipboardList size={23} />
      </div>
    </div>
  </div>

  <div className="panel">
    <div className="panel-header">
      <div>
        <div className="panel-title">
          Admin Dashboard
        </div>

        <div className="panel-description">
          GET /admin/dashboard
        </div>
      </div>

      <button
        className="secondary-button"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw size={16} />
        รีเฟรชข้อมูล
      </button>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 15,
      }}
    >
      <div className="company-card">
        <Users size={23} color="#800000" />
        <div
          style={{
            fontSize: 25,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          {students.length}
        </div>
        <div style={{ color: "#777" }}>
          นักศึกษา
        </div>
      </div>

      <div className="company-card">
        <Building2 size={23} color="#800000" />
        <div
          style={{
            fontSize: 25,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          {companies.length}
        </div>
        <div style={{ color: "#777" }}>
          บริษัท
        </div>
      </div>

      <div className="company-card">
        <FileText size={23} color="#800000" />
        <div
          style={{
            fontSize: 25,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          {applications.length}
        </div>
        <div style={{ color: "#777" }}>
          ใบสมัคร
        </div>
      </div>
    </div>
  </div>
</>
```

);
}

// ============================================================
// ADMIN STUDENTS
// ============================================================

function AdminStudents({
students,
loading,
onRefresh,
onDelete,
}) {
return ( <div className="panel"> <div className="panel-header"> <div> <div className="panel-title">
จัดการนักศึกษา </div>

```
      <div className="panel-description">
        GET /students
      </div>
    </div>

    <button
      className="secondary-button"
      onClick={onRefresh}
      disabled={loading}
    >
      <RefreshCw size={16} />
      รีเฟรช
    </button>
  </div>

  {loading ? (
    <div className="loading">
      <div className="spinner" />
      กำลังโหลดข้อมูล...
    </div>
  ) : students.length === 0 ? (
    <div className="empty-state">
      <Users size={40} />
      ไม่พบข้อมูลนักศึกษา
    </div>
  ) : (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>รหัสนักศึกษา</th>
            <th>ชื่อ</th>
            <th>คณะ</th>
            <th>สาขา</th>
            <th>เบอร์โทร</th>
            <th>จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.student_id}</td>
              <td>
                {student.first_name}{" "}
                {student.last_name}
              </td>
              <td>{student.faculty}</td>
              <td>{student.major}</td>
              <td>{student.phone}</td>
              <td>
                <button
                  className="danger-button"
                  onClick={() =>
                    onDelete(student.id)
                  }
                >
                  <Trash2 size={15} />
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
```

);
}

// ============================================================
// UPLOAD PDF
// ============================================================

function UploadPDF() {
const [file, setFile] = useState(null);
const [uploading, setUploading] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState("");

const upload = async () => {
if (!file) {
setError("กรุณาเลือกไฟล์ PDF");
return;
}

```
if (file.type !== "application/pdf") {
  setError("สามารถอัปโหลดได้เฉพาะไฟล์ PDF");
  return;
}

try {
  setUploading(true);
  setError("");
  setResult(null);

  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/upload-pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  setResult(response.data);
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "อัปโหลดไฟล์ไม่สำเร็จ"
    )
  );
} finally {
  setUploading(false);
}
```

};

return ( <div className="panel"> <div className="panel-header"> <div> <div className="panel-title">
อัปโหลดเอกสาร PDF </div>

```
      <div className="panel-description">
        POST /upload-pdf
      </div>
    </div>

    <Upload size={22} color="#800000" />
  </div>

  {error && (
    <div className="alert-box alert-error">
      <AlertCircle size={18} />
      {error}
    </div>
  )}

  {result && (
    <div className="alert-box alert-success">
      <CheckCircle2 size={18} />
      อัปโหลดสำเร็จ: {result.filename}
    </div>
  )}

  <div className="form-group">
    <label className="form-label">
      เลือกไฟล์ PDF
    </label>

    <input
      className="form-input"
      type="file"
      accept="application/pdf,.pdf"
      onChange={(e) =>
        setFile(e.target.files?.[0] || null)
      }
    />
  </div>

  <div className="form-actions">
    <button
      className="primary-button"
      onClick={upload}
      disabled={uploading}
    >
      <Upload size={16} />
      {uploading
        ? "กำลังอัปโหลด..."
        : "อัปโหลด PDF"}
    </button>
  </div>
</div>
```

);
}

// ============================================================
// MAIN APP
// ============================================================

function MainAppContainer() {
const [loggedIn, setLoggedIn] = useState(
Boolean(localStorage.getItem("token"))
);

const [role, setRole] = useState(
localStorage.getItem("userRole") || "student"
);

const [username, setUsername] = useState(
localStorage.getItem("username") || ""
);

const [profile, setProfile] = useState(null);
const [teacherProfile, setTeacherProfile] = useState(null);

const [teacherStudents, setTeacherStudents] = useState([]);
const [teacherDashboard, setTeacherDashboard] =
useState(null);
const [teacherSupervisions, setTeacherSupervisions] =
useState([]);

const [students, setStudents] = useState([]);
const [companies, setCompanies] = useState([]);
const [applications, setApplications] = useState([]);
const [adminDashboard, setAdminDashboard] =
useState(null);

const [teacher, setTeacher] = useState([]);

const [activePage, setActivePage] =
useState("overview");

const [loading, setLoading] = useState(false);
const [pageLoading, setPageLoading] =
useState(false);

const [error, setError] = useState("");
const [sidebarOpen, setSidebarOpen] =
useState(false);

// ==========================================================
// LOAD PROFILE
// ==========================================================

const loadProfile = async () => {
try {
if (role === "student") {
const response = await api.get("/student/me");

```
    setProfile(response.data);
  }

  if (role === "advisor") {
    const response = await api.get("/teacher/me");

    setTeacherProfile(response.data);
  }
} catch (error) {
  if (error?.response?.status === 401) {
    logout();
    return;
  }

  setError(
    getErrorMessage(
      error,
      "ไม่สามารถโหลดข้อมูล Profile ได้"
    )
  );
}
```

};

// ==========================================================
// LOAD COMPANIES
// ==========================================================

const loadCompanies = async () => {
try {
setLoading(true);

```
  const response = await api.get("/companies");

  setCompanies(normalizeArray(response.data));
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถโหลดข้อมูลบริษัทได้"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// LOAD APPLICATIONS
// ==========================================================

const loadApplications = async () => {
try {
setLoading(true);

```
  const response = await api.get("/applications");

  setApplications(
    normalizeArray(response.data)
  );
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถโหลดข้อมูลใบสมัครได้"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// LOAD ADMIN STUDENTS
// ==========================================================

const loadStudents = async () => {
if (role !== "coordinator") return;

```
try {
  setLoading(true);

  const response = await api.get("/students");

  setStudents(normalizeArray(response.data));
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถโหลดข้อมูลนักศึกษาได้"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// LOAD ADMIN DASHBOARD
// ==========================================================

const loadAdminDashboard = async () => {
if (role !== "coordinator") return;

```
try {
  const response = await api.get(
    "/admin/dashboard"
  );

  setAdminDashboard(response.data);
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถโหลด Admin Dashboard ได้"
    )
  );
}
```

};

// ==========================================================
// LOAD STUDENT TEACHER
// ==========================================================

const loadStudentTeacher = async () => {
if (role !== "student") return;

```
try {
  const response = await api.get(
    "/student/teacher"
  );

  setTeacher(normalizeArray(response.data));
} catch (error) {
  // 404 means teacher may not have been assigned.
  if (error?.response?.status !== 404) {
    setError(
      getErrorMessage(
        error,
        "ไม่สามารถโหลดข้อมูลอาจารย์ได้"
      )
    );
  }

  setTeacher([]);
}
```

};

// ==========================================================
// LOAD TEACHER DATA
// ==========================================================

const loadTeacherData = async () => {
if (role !== "advisor") return;

```
try {
  setPageLoading(true);

  const [
    profileResponse,
    studentsResponse,
    dashboardResponse,
    supervisionResponse,
  ] = await Promise.all([
    api.get("/teacher/me"),
    api.get("/teacher/students"),
    api.get("/teacher/dashboard"),
    api.get("/teacher/supervisions"),
  ]);

  setTeacherProfile(profileResponse.data);

  setTeacherStudents(
    normalizeArray(studentsResponse.data)
  );

  setTeacherDashboard(
    dashboardResponse.data
  );

  setTeacherSupervisions(
    normalizeArray(
      supervisionResponse.data
    )
  );
} catch (error) {
  if (error?.response?.status === 401) {
    logout();
    return;
  }

  setError(
    getErrorMessage(
      error,
      "ไม่สามารถโหลดข้อมูลอาจารย์ได้"
    )
  );
} finally {
  setPageLoading(false);
}
```

};

// ==========================================================
// LOAD ALL DATA
// ==========================================================

const loadAllData = async () => {
if (!loggedIn) return;

```
setError("");

await loadProfile();
await loadCompanies();
await loadApplications();

if (role === "student") {
  await loadStudentTeacher();
}

if (role === "coordinator") {
  await loadStudents();
  await loadAdminDashboard();
}

if (role === "advisor") {
  await loadTeacherData();
}
```

};

useEffect(() => {
if (loggedIn) {
loadAllData();
}
}, [loggedIn, role]);

// ==========================================================
// LOGIN
// ==========================================================

const handleLoginSuccess = (
newRole,
newUsername
) => {
setRole(newRole);
setUsername(newUsername);
setLoggedIn(true);
setActivePage("overview");
setError("");
};

// ==========================================================
// LOGOUT
// ==========================================================

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("username");
localStorage.removeItem("userRole");
localStorage.removeItem("backendRole");

```
setLoggedIn(false);
setProfile(null);
setTeacherProfile(null);
setTeacherStudents([]);
setTeacherDashboard(null);
setTeacherSupervisions([]);
setStudents([]);
setCompanies([]);
setApplications([]);
setTeacher([]);
```

};

// ==========================================================
// APPLY COMPANY
// ==========================================================

const handleApplyCompany = async (company) => {
if (!profile?.id) {
alert(
"ไม่พบ ID ของนักศึกษา กรุณาตรวจสอบ Student Profile"
);
return;
}

```
const confirmed = window.confirm(
  `ต้องการสมัคร "${company.company_name}" หรือไม่?`
);

if (!confirmed) return;

try {
  setLoading(true);
  setError("");

  await api.post("/apply", {
    student_id: Number(profile.id),
    company_id: Number(company.id),
  });

  alert("ส่งใบสมัครเรียบร้อยแล้ว");

  await loadApplications();

  setActivePage("applications");
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "สมัครสถานประกอบการไม่สำเร็จ"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// APPROVE APPLICATION
// ==========================================================

const handleApproveApplication = async (
applicationId
) => {
const confirmed = window.confirm(
"ยืนยันการอนุมัติใบสมัครนี้หรือไม่?"
);

```
if (!confirmed) return;

try {
  setLoading(true);

  await api.put(
    `/applications/${applicationId}/approve`
  );

  await loadApplications();
  await loadAdminDashboard();

  alert("อนุมัติใบสมัครเรียบร้อยแล้ว");
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถอนุมัติใบสมัครได้"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// REJECT APPLICATION
// ==========================================================

const handleRejectApplication = async (
applicationId
) => {
const confirmed = window.confirm(
"ยืนยันการปฏิเสธใบสมัครนี้หรือไม่?"
);

```
if (!confirmed) return;

try {
  setLoading(true);

  await api.put(
    `/applications/${applicationId}/reject`
  );

  await loadApplications();
  await loadAdminDashboard();

  alert("ปฏิเสธใบสมัครเรียบร้อยแล้ว");
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถปฏิเสธใบสมัครได้"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// DELETE STUDENT
// ==========================================================

const handleDeleteStudent = async (
studentId
) => {
const confirmed = window.confirm(
"ยืนยันการลบนักศึกษาคนนี้หรือไม่?"
);

```
if (!confirmed) return;

try {
  setLoading(true);

  await api.delete(
    `/students/${studentId}`
  );

  await loadStudents();
  await loadAdminDashboard();

  alert("ลบนักศึกษาเรียบร้อยแล้ว");
} catch (error) {
  setError(
    getErrorMessage(
      error,
      "ไม่สามารถลบนักศึกษาได้"
    )
  );
} finally {
  setLoading(false);
}
```

};

// ==========================================================
// SAVE STUDENT PROFILE
// ==========================================================

const handleStudentProfileSaved = (
updatedProfile
) => {
setProfile(updatedProfile);
};

// ==========================================================
// MENU
// ==========================================================

const menus = {
student: [
{
key: "overview",
label: "ภาพรวม",
icon: LayoutDashboard,
},
{
key: "profile",
label: "ข้อมูลส่วนตัว",
icon: User,
},
{
key: "company",
label: "สถานประกอบการ",
icon: Building2,
},
{
key: "applications",
label: "ใบสมัครของฉัน",
icon: FileText,
},
{
key: "upload",
label: "เอกสาร PDF",
icon: Upload,
},
],

```
advisor: [
  {
    key: "overview",
    label: "ภาพรวม",
    icon: LayoutDashboard,
  },
  {
    key: "company",
    label: "สถานประกอบการ",
    icon: Building2,
  },
  {
    key: "students",
    label: "นักศึกษาที่รับผิดชอบ",
    icon: Users,
  },
  {
    key: "supervision",
    label: "ประวัติการนิเทศ",
    icon: ClipboardList,
  },
],

coordinator: [
  {
    key: "overview",
    label: "ภาพรวม",
    icon: LayoutDashboard,
  },
  {
    key: "applications",
    label: "จัดการใบสมัคร",
    icon: FileText,
  },
  {
    key: "students",
    label: "นักศึกษา",
    icon: Users,
  },
  {
    key: "company",
    label: "สถานประกอบการ",
    icon: Building2,
  },
],
```

};

const currentMenus = menus[role] || menus.student;

const currentMenu =
currentMenus.find(
(item) => item.key === activePage
) || currentMenus[0];

// ==========================================================
// PAGE TITLE
// ==========================================================

const pageTitles = {
overview: "ภาพรวม",
profile: "ข้อมูลส่วนตัว",
company: "สถานประกอบการ",
applications: "ใบสมัคร",
upload: "เอกสาร PDF",
students: "นักศึกษา",
supervision: "การนิเทศ",
};

// ==========================================================
// RENDER PAGE
// ==========================================================

const renderPage = () => {
if (pageLoading) {
return ( <div className="panel"> <div className="loading"> <div className="spinner" />
กำลังโหลดข้อมูล... </div> </div>
);
}

```
if (activePage === "overview") {
  if (role === "student") {
    return (
      <StudentOverview
        profile={profile}
        applications={applications}
        companies={companies}
        teacher={teacher}
        loading={loading}
        onRefresh={loadAllData}
        onNavigate={setActivePage}
      />
    );
  }

  if (role === "advisor") {
    return (
      <TeacherDashboard
        teacherProfile={teacherProfile}
        teacherStudents={teacherStudents}
        teacherDashboard={teacherDashboard}
        teacherSupervisions={
          teacherSupervisions
        }
        onRefresh={loadTeacherData}
      />
    );
  }

  if (role === "coordinator") {
    return (
      <AdminDashboard
        dashboard={adminDashboard}
        applications={applications}
        students={students}
        companies={companies}
        loading={loading}
        onRefresh={loadAllData}
      />
    );
  }
}

if (
  activePage === "profile" &&
  role === "student"
) {
  return (
    <StudentProfile
      profile={profile}
      onSaved={handleStudentProfileSaved}
    />
  );
}

if (activePage === "company") {
  return (
    <CompanyManagement
      role={role}
      companies={companies}
      loading={loading}
      onRefresh={loadCompanies}
      onApply={handleApplyCompany}
    />
  );
}

if (activePage === "applications") {
  let displayApplications =
    applications;

  if (role === "student" && profile?.id) {
    displayApplications =
      applications.filter(
        (application) =>
          Number(application.student_id) ===
          Number(profile.id)
      );
  }

  return (
    <ApplicationManagement
      role={role}
      applications={displayApplications}
      students={students}
      companies={companies}
      loading={loading}
      onRefresh={loadApplications}
      onApprove={
        handleApproveApplication
      }
      onReject={
        handleRejectApplication
      }
    />
  );
}

if (
  activePage === "upload" &&
  role === "student"
) {
  return <UploadPDF />;
}

if (
  activePage === "students" &&
  role === "coordinator"
) {
  return (
    <AdminStudents
      students={students}
      loading={loading}
      onRefresh={loadStudents}
      onDelete={handleDeleteStudent}
    />
  );
}

if (
  activePage === "students" &&
  role === "advisor"
) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            นักศึกษาที่รับผิดชอบ
          </div>

          <div className="panel-description">
            GET /teacher/students
          </div>
        </div>

        <button
          className="secondary-button"
          onClick={loadTeacherData}
        >
          <RefreshCw size={16} />
          รีเฟรช
        </button>
      </div>

      {teacherStudents.length === 0 ? (
        <div className="empty-state">
          <Users size={40} />
          ไม่พบข้อมูลนักศึกษา
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่อ</th>
                <th>บริษัท</th>
                <th>แผนก</th>
                <th>อุตสาหกรรม</th>
                <th>รูปแบบงาน</th>
              </tr>
            </thead>

            <tbody>
              {teacherStudents.map(
                (student) => (
                  <tr key={student.id}>
                    <td>
                      {student.student_id}
                    </td>

                    <td>
                      {student.student_name}
                    </td>

                    <td>
                      {student.company_name}
                    </td>

                    <td>
                      {student.department ||
                        "-"}
                    </td>

                    <td>
                      {student.industry ||
                        "-"}
                    </td>

                    <td>
                      {student.work_modes ||
                        "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

if (
  activePage === "supervision" &&
  role === "advisor"
) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            ประวัติการนิเทศ
          </div>

          <div className="panel-description">
            GET /teacher/supervisions
          </div>
        </div>

        <button
          className="secondary-button"
          onClick={loadTeacherData}
        >
          <RefreshCw size={16} />
          รีเฟรช
        </button>
      </div>

      {teacherSupervisions.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={40} />
          ยังไม่มีข้อมูลการนิเทศ
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>นักศึกษา</th>
                <th>บริษัท</th>
                <th>อุตสาหกรรม</th>
                <th>ประเภท</th>
                <th>สถานะ</th>
              </tr>
            </thead>

            <tbody>
              {teacherSupervisions.map(
                (item, index) => (
                  <tr key={index}>
                    <td>
                      {formatDate(item.date)}
                    </td>

                    <td>
                      {item.student_id}
                      <br />
                      {
                        item.student_first_name
                      }{" "}
                      {
                        item.student_last_name
                      }
                    </td>

                    <td>
                      {item.company_name}
                    </td>

                    <td>
                      {item.industry}
                    </td>

                    <td>
                      {item.type}
                    </td>

                    <td>
                      <span
                        className={`status ${statusClass(
                          item.status
                        )}`}
                      >
                        {statusText(
                          item.status
                        )}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

return (
  <div className="panel">
    <div className="empty-state">
      <AlertCircle size={40} />
      <div>
        ไม่พบหน้าที่ต้องการ
      </div>
    </div>
  </div>
);
```

};

// ==========================================================
// LOGIN
// ==========================================================

if (!loggedIn) {
return (
<> <style>{styles}</style>

```
    <LoginPage
      onLogin={handleLoginSuccess}
    />
  </>
);
```

}

// ==========================================================
// APP
// ==========================================================

return (
<> <style>{styles}</style>

```
  <div className="app-shell">
    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >
      <div className="brand">
        <div className="brand-title">
          Coop Education
        </div>

        <div className="brand-subtitle">
          ระบบจัดการสหกิจศึกษา
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-title">
          MENU
        </div>

        {currentMenus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              className={`menu-button ${
                activePage === item.key
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActivePage(item.key);
                setSidebarOpen(false);
                setError("");
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="user-mini">
          <div className="user-mini-avatar">
            <User size={19} />
          </div>

          <div className="user-mini-info">
            <div className="user-mini-name">
              {role === "student"
                ? `${profile?.first_name || ""} ${
                    profile?.last_name || ""
                  }`
                : role === "advisor"
                ? `${teacherProfile?.first_name || ""} ${
                    teacherProfile?.last_name || ""
                  }`
                : username}
            </div>

            <div className="user-mini-role">
              {role === "student"
                ? "Student"
                : role === "advisor"
                ? "Teacher"
                : "Admin"}
            </div>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="mobile-menu-button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            <Menu size={23} />
          </button>

          <div>
            <div className="page-title">
              {pageTitles[activePage] ||
                currentMenu.label}
            </div>

            <div className="page-subtitle">
              Cooperative Education Management
            </div>
          </div>
        </div>

        <div className="top-user">
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                textAlign: "right",
              }}
            >
              {username}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#777",
                textAlign: "right",
              }}
            >
              {role === "student"
                ? "นักศึกษา"
                : role === "advisor"
                ? "อาจารย์"
                : "ผู้ดูแลระบบ"}
            </div>
          </div>

          <div className="top-avatar">
            <User size={20} />
          </div>
        </div>
      </header>

      <section className="content">
        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <div style={{ flex: 1 }}>
              {error}
            </div>

            <button
              style={{
                border: 0,
                background: "transparent",
                color: "inherit",
              }}
              onClick={() =>
                setError("")
              }
            >
              <X size={17} />
            </button>
          </div>
        )}

        {renderPage()}
      </section>
    </main>
  </div>
</>
```

);
}

export default MainAppContainer;
