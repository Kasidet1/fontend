import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3, LogOut, Menu, X,
  Factory, FileSearch,
  ChevronRight, User, MapPin, Phone,
  Building2, Info, Filter,
  CheckCircle2, Clock, Calendar, GraduationCap,
  ShieldAlert, ClipboardCheck, Users, Shield, Eye, EyeOff, Download
} from 'lucide-react';

// --- Configuration ---
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
});

// --- Component โลโก้หุ่นยนต์เฟืองสีแดง ---
const RobotLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M482.3 221.7l-35.9-5.9c-3.9-15.6-9.9-30.4-17.7-44l21.3-29.4c6.3-8.7 5.1-20.9-2.9-28.2l-32.9-30c-7.9-7.2-20.2-7.2-28 0l-22.5 19.3c-14.1-8.9-29.6-15.6-46.1-19.8l-7-35.7C312 36.5 302 28 290.3 28h-44.5c-11.7 0-21.7 8.5-23.4 20l-7 35.7c-16.5 4.2-32 10.9-46.1 19.8L146.8 84.2c-7.8-7.2-20.1-7.2-28 0l-32.9 30c-8 7.3-9.2 19.5-2.9 28.2l21.3 29.4c-7.8 13.6-13.8 28.4-17.7 44l-35.9 5.9C39 223.4 30.5 233.1 30.5 244.7v44.5c0 11.6 8.5 21.3 20.2 23l35.9 5.9c3.9 15.6 9.9 30.4 17.7 44l-21.3 29.4c-6.3 8.7-5.1 20.9 2.9 28.2l32.9 30c7.9 7.2 20.2 7.2 28 0l22.5-19.3c14.1 8.9 29.6 15.6 46.1 19.8l7 35.7c1.7 11.5 11.7 20 23.4 20h44.5c11.7 0 21.7-8.5 23.4-20l7-35.7c16.5-4.2 32-10.9 46.1-19.8l22.5 19.3c7.8 7.2 20.1 7.2 28 0l32.9-30c8-7.3 9.2-19.5 2.9-28.2l-21.3-29.4c7.8-13.6 13.8-28.4 17.7-44l35.9-5.9c11.7-1.7 20.2-11.4 20.2-23v-44.5c0-11.6-8.5-21.3-20.2-23z" fill="#ff4d4d" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="256" cy="256" r="135" fill="#fff" stroke="#000" strokeWidth="16"/>
    <rect x="180" y="210" width="152" height="100" rx="25" fill="#e0e0e0" stroke="#000" strokeWidth="16"/>
    <circle cx="225" cy="260" r="14" fill="#000"/>
    <circle cx="287" cy="260" r="14" fill="#000"/>
    <rect x="148" y="235" width="32" height="50" rx="16" fill="#b0b0b0" stroke="#000" strokeWidth="16"/>
    <rect x="332" y="235" width="32" height="50" rx="16" fill="#b0b0b0" stroke="#000" strokeWidth="16"/>
    <line x1="256" y1="210" x2="256" y2="175" stroke="#000" strokeWidth="16" strokeLinecap="round"/>
    <circle cx="256" cy="160" r="18" fill="#ff4d4d" stroke="#000" strokeWidth="12"/>
    <line x1="230" y1="290" x2="282" y2="290" stroke="#000" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

// --- 1. ส่วนแสดงข้อมูลสถานประกอบการ ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState('All');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies', {
          params: searchTerm ? { search: searchTerm } : {}
        });
        const data = Array.isArray(res.data) ? res.data : (res.data.companies || []);
        setCompanies(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCompanies();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const filteredCompanies = companies.filter(company => {
    if (filterIndustry === 'All') return true;
    if (filterIndustry === 'Industry') return company.industry?.includes('อุตสาหกรรม') || company.industry?.toLowerCase().includes('manufacture');
    if (filterIndustry === 'IT') return company.industry?.includes('เทคโนโลยี') || company.industry?.toLowerCase().includes('it') || company.industry?.toLowerCase().includes('tech');
    if (filterIndustry === 'Other') return !company.industry;
    return true;
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
          <Factory size={24}/> รายชื่อสถานประกอบการ
        </h3>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="ค้นหาบริษัท (เช่น CP)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000] font-bold"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${showFilterMenu ? 'bg-[#800000] text-white border-[#800000]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
            >
              <Filter size={18} />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">ประเภทธุรกิจ</p>
                {[
                  { id: 'All', name: 'ทั้งหมด' },
                  { id: 'Industry', name: 'โรงงาน / อุตสาหกรรม' },
                  { id: 'IT', name: 'IT / เทคโนโลยี' },
                  { id: 'Other', name: 'ทั่วไป / ไม่ระบุ' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFilterIndustry(type.id);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${filterIndustry === type.id ? 'bg-red-50 text-[#800000]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    • {type.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filterIndustry !== 'All' && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">ตัวกรองปัจจุบัน:</span>
          <span className="inline-flex items-center gap-1 bg-red-50 text-[#800000] text-xs font-black px-3 py-1 rounded-full border border-red-100">
            {filterIndustry === 'Industry' && 'โรงงาน / อุตสาหกรรม'}
            {filterIndustry === 'IT' && 'IT / เทคโนโลยี'}
            {filterIndustry === 'Other' && 'ทั่วไป / ไม่ระบุ'}
            <X size={12} className="cursor-pointer ml-1" onClick={() => setFilterIndustry('All')} />
          </span>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">กำลังดึงข้อมูล...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-bold">ไม่พบข้อมูลสถานประกอบการในกลุ่มนี้</div>
        ) : (
          filteredCompanies.map((company, index) => (
            <div
              key={company.id || index}
              onClick={() => setSelectedCompany(company)}
              className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-red-50/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-colors rounded-lg flex items-center justify-center font-bold text-[#800000]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-black text-gray-800">{company.company_name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                      <MapPin size={12} /> {company.address}
                    </p>
                    {company.industry && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold">
                        {company.industry}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-[#800000]" />
            </div>
          ))
        )}
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative">
            <div className="bg-[#800000] p-8 text-white">
              <button onClick={() => setSelectedCompany(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#800000]">
                  <Building2 size={32} />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black leading-tight">{selectedCompany.company_name}</h4>
                  <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                    {selectedCompany.industry || "ทั่วไป"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex gap-3">
                  <MapPin className="text-[#800000] shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">ที่ตั้ง</p>
                    <p className="text-gray-800 font-bold">{selectedCompany.address}</p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex gap-3">
                  <Phone className="text-[#800000] shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">เบอร์โทรศัพท์</p>
                    <p className="text-gray-800 font-black text-lg">
                      {selectedCompany.phone || "ไม่ระบุเบอร์โทร"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-red-50/30 rounded-3xl border border-red-100">
                <p className="text-[10px] font-black text-[#800000] uppercase mb-3 flex items-center gap-2">
                  <Info size={14} /> รายละเอียดและสวัสดิการ
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">เบี้ยเลี้ยง</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.allowance || "ไม่มี"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">ที่พัก</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.accommodation || "ไม่มี"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">รถรับส่ง</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.shuttle || "ไม่มี"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">สวัสดิการอื่นๆ</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.welfare || "ไม่มี"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-end">
              <button onClick={() => setSelectedCompany(null)} className="px-10 py-3 bg-white text-gray-600 rounded-2xl font-black border border-gray-200 shadow-sm">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. ส่วนของอาจารย์ผู้ประสานงานรายวิชา (Coordinator View) ---
const CoordinatorManagement = ({ activeTab }) => {
  const [students, setStudents] = useState([
    { id: "ST6601", name: "สมชาย สายฟ้า", company: "CP All", status: "Wait", major: "CPE", role: "student", access: true },
    { id: "ST6602", name: "สมหญิง มิ่งขวัญ", company: "Agoda", status: "Approved", major: "AI", role: "student", access: true },
    { id: "AD7701", name: "ศ.ดร.สมเกียรติ รักเรียน", company: "อาจารย์นิเทศก์คอมพิวเตอร์", status: "-", major: "CPE", role: "advisor", access: true }
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: "ส่งใบสมัครเลือกสถานประกอบการ", date: "2569-07-30", type: "Calendar" },
    { id: 2, title: "วันส่งรายงานความก้าวหน้าครั้งที่ 1", date: "2569-08-15", type: "Report" },
    { id: 3, title: "ช่วงออกตรวจนิเทศงานรอบที่ 1", date: "2569-09-01", type: "Supervise" }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(st => st.id === id ? { ...st, status: newStatus } : st));
  };

  const toggleAccess = (id) => {
    setStudents(students.map(st => st.id === id ? { ...st, access: !st.access } : st));
  };

  const handleRoleChange = (id, newRole) => {
    setStudents(students.map(st => st.id === id ? { ...st, role: newRole } : st));
  };

  if (activeTab === 'manage_requests') {
    return (
      <div className="space-y-6">
        {/* สถิติรายงานภาพรวมคำร้อง */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-black text-emerald-600">สถิติ: อนุมัติผ่านแล้ว</p>
              <h4 className="text-2xl font-black text-emerald-700 mt-1">
                {students.filter(s => s.status === 'Approved').length} <span className="text-xs font-bold text-gray-400">บริษัท</span>
              </h4>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">OK</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-amber-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-black text-amber-600">สถิติ: รอการตรวจสอบ</p>
              <h4 className="text-2xl font-black text-amber-700 mt-1">
                {students.filter(s => s.status === 'Wait').length} <span className="text-xs font-bold text-gray-400">รายการ</span>
              </h4>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black">WAIT</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-red-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-black text-red-600">สถิติ: ปฏิเสธ/ไม่ผ่าน</p>
              <h4 className="text-2xl font-black text-red-700 mt-1">
                {students.filter(s => s.status === 'Rejected').length} <span className="text-xs font-bold text-gray-400">รายการ</span>
              </h4>
            </div>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black">REJ</div>
          </div>
        </div>

        {/* ตารางคำร้องเลือกสถานประกอบการ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
            <ClipboardCheck size={24}/> จัดการและอนุมัติคำร้องเลือกสถานประกอบการ
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">รหัสนักศึกษา</th>
                  <th className="pb-3">ชื่อ-นามสกุล</th>
                  <th className="pb-3">สาขา</th>
                  <th className="pb-3">บริษัทที่ยื่นร้องขอ</th>
                  <th className="pb-3 text-center">สถานะ</th>
                  <th className="pb-3 text-right">การจัดการจัดการ</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
                {students.filter(s => s.status !== '-').map(st => (
                  <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-black text-gray-500">{st.id}</td>
                    <td className="py-4 text-gray-800">{st.name}</td>
                    <td className="py-4"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{st.major}</span></td>
                    <td className="py-4 font-black text-[#800000]">{st.company}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        st.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        st.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {st.status === 'Approved' ? 'อนุมัติเรียบร้อย' : st.status === 'Rejected' ? 'ปฏิเสธคำร้อง' : 'รอตรวจสอบ'}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button onClick={() => handleStatusChange(st.id, 'Approved')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-sm">อนุมัติ</button>
                      <button onClick={() => handleStatusChange(st.id, 'Rejected')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-sm">ปฏิเสธ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'all_students') {
    return (
      <div className="space-y-6">
        {/* จัดการข้อมูลพื้นฐาน และ สิทธิ์ผู้ใช้ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
              <Users size={24}/> จัดการฐานข้อมูลพื้นฐาน และ บทบาทสิทธิ์ผู้ใช้งาน (User Roles)
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1">สามารถกำหนดแก้ไขบทบาท หรือ เปิด-ปิดการเข้าถึงระบบแบบ Real-time ของบุคคลในวิทยาลัย</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase">
                  <th className="pb-3">รหัสประจำตัว</th>
                  <th className="pb-3">ชื่อ-นามสกุล</th>
                  <th className="pb-3">บทบาทระบบ</th>
                  <th className="pb-3 text-center">สิทธิ์การเข้าถึงฟังก์ชัน</th>
                  <th className="pb-3 text-right">สถานะระบบ</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
                {students.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="py-4 font-mono text-gray-400 text-xs">{user.id}</td>
                    <td className="py-4">{user.name}</td>
                    <td className="py-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-50 border border-gray-100 text-xs font-black rounded-xl p-2 outline-none focus:border-[#800000]"
                      >
                        <option value="student">นักศึกษา</option>
                        <option value="advisor">อาจารย์นิเทศก์</option>
                        <option value="coordinator">ผู้ประสานงาน</option>
                      </select>
                    </td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => toggleAccess(user.id)}
                        className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border ${
                          user.access ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        {user.access ? <Eye size={12} /> : <EyeOff size={12} />}
                        {user.access ? 'เปิดการเข้าถึงปกติ' : 'ปิดการเข้าถึงอยู่'}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`w-2.5 h-2.5 inline-block rounded-full ${user.access ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* จัดการปฏิทินและกำหนดการ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-gray-800 font-black flex items-center gap-2 text-base">
              <Calendar size={20} className="text-[#800000]" /> ปฏิทินกำหนดการกิจกรรม และวันส่งรายงานเอกสารกลาง
            </h4>
            <button onClick={() => alert("ระบบฟอร์มเพิ่มปฏิทินกลาง")} className="px-3 py-1.5 bg-[#800000] text-white font-black text-xs rounded-xl hover:bg-black transition-colors">
              + เพิ่มกำหนดการใหม่
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map(ev => (
              <div key={ev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[9px] bg-red-50 text-[#800000] px-2 py-0.5 rounded font-black uppercase tracking-wider">{ev.type}</span>
                  <p className="text-sm font-black text-gray-800 mt-2">{ev.title}</p>
                </div>
                <div className="text-xs font-bold text-gray-400 border-t border-gray-200/60 pt-2 flex justify-between items-center">
                  <span>วันกำหนดการ:</span>
                  <span className="text-gray-800 font-black">{ev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- 3. ส่วนของอาจารย์นิเทศก์ (Advisor View) ---
const AdvisorManagement = ({ activeTab }) => {
  const [myStudents, setMyStudents] = useState([
    { id: "ST6602", name: "สมหญิง มิ่งขวัญ", company: "Agoda (สำนักงานใหญ่ สุขุมวิท)", industry: "IT & Tech", docName: "รายงานความก้าวหน้าสหกิจ_รอบที่1.pdf", note: "ความก้าวหน้างาน 50% ระบบฐานข้อมูลพัฒนาได้ตามแผนงาน" },
    { id: "ST6605", name: "เกียรติศักดิ์ อุดมสุข", company: "สถาบันวิจัยปัญญาประดิษฐ์ AI-Lab", industry: "Research & Development", docName: "เล่มรายงานฉบับสมบูรณ์_Draft1.pdf", note: "" }
  ]);

  const handleUpdateNote = (id, newText) => {
    setMyStudents(myStudents.map(s => s.id === id ? { ...s, note: newText } : s));
    alert("บันทึกผลการนิเทศและกรอกข้อเสนอแนะสำเร็จ");
  };

  if (activeTab === 'supervise') {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
            <ClipboardCheck size={24}/> บันทึกผลตรวจการนิเทศงาน และตรวจรับเอกสารนักศึกษา
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">อาจารย์สามารถดาวน์โหลดไฟล์เอกสารรายงาน ตรวจบันทึกผลคะแนนความก้าวหน้าพร้อมบันทึกคำแนะนำได้</p>
        </div>

        <div className="space-y-6">
          {myStudents.map(student => (
            <div key={student.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
                <div>
                  <h4 className="font-black text-gray-800 text-sm md:text-base">{student.name} ({student.id})</h4>
                  <p className="text-xs text-gray-400 font-bold mt-1">🏢 ปฏิบัติงาน ณ: <span className="text-gray-700 font-black">{student.company}</span></p>
                </div>
                
                {/* ปุ่มดาวน์โหลดไฟล์ที่นักศึกษาส่ง */}
                <button 
                  onClick={() => alert(`กำลังดาวน์โหลดไฟล์: ${student.docName}`)}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl text-xs font-black hover:bg-blue-100 transition-colors self-start md:self-auto"
                >
                  <Download size={14} /> {student.docName}
                </button>
              </div>

              {/* แบบฟอร์มบันทึกผลตรวจงาน */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 block">ผลการตรวจประเมินนิเทศงาน และข้อเสนอแนะเพิ่มเติม</label>
                <div className="flex gap-2">
                  <textarea
                    defaultValue={student.note}
                    placeholder="กรอกข้อความแนะนำการปฏิบัติตัว เล่มรายงาน หรือผลการฝึกงานที่นี่..."
                    id={`note-${student.id}`}
                    className="w-full p-4 text-xs font-bold bg-white border border-gray-100 rounded-2xl outline-none focus:border-[#800000] min-h-[90px] transition-colors"
                  />
                  <button 
                    onClick={() => {
                      const text = document.getElementById(`note-${student.id}`).value;
                      handleUpdateNote(student.id, text);
                    }}
                    className="bg-[#800000] hover:bg-black text-white font-black text-xs px-4 rounded-2xl shadow-sm transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'my_students') {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
          <Users size={24}/> รายชื่อนักศึกษาในความดูแลรับผิดชอบ (ความปรึกษาอาจารย์นิเทศก์)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myStudents.map(student => (
            <div key={student.id} className="p-5 border border-gray-100 rounded-2xl hover:bg-red-50/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-[#800000] flex items-center justify-center font-black text-xs border border-gray-100">
                CPE
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-black text-gray-800 text-sm">{student.name}</h4>
                <p className="text-[11px] text-gray-400 font-bold">รหัสประจำตัว: {student.id}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-md block md:inline-block">
                    📍 {student.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- 4. Main Container ---
const MainAppContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'student');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const [profileData, setProfileData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  useEffect(() => {
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
  }, [isLoggedIn, userRole]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfileData(null);
    setUserRole('student');
    setActiveTab('overview');
  };

  const handleLoginSuccess = (role, username) => {
    setUserRole(role);
    setProfileData(username ? { username } : null);
    setIsLoggedIn(true);
  };

  const displayId = profileData?.student_id || profileData?.staff_id || profileData?.username || '-';
  const displayFullName = profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : fetchingUser
      ? 'กำลังโหลด...'
      : profileData?.username || 'ผู้ใช้งานระบบ';

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

  const getMenuItems = () => {
    if (userRole === 'student') {
      return [
        { id: 'overview', name: 'หน้าหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'บริษัท', icon: <Factory size={20}/> },
        { id: 'request', name: 'คำร้องของฉัน', icon: <FileSearch size={20}/> }
      ];
    } else if (userRole === 'coordinator') {
      return [
        { id: 'overview', name: 'แผงควบคุมหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'จัดการบริษัท', icon: <Factory size={20}/> },
        { id: 'manage_requests', name: 'อนุมัติคำร้องนักศึกษา', icon: <ClipboardCheck size={20}/> },
        { id: 'all_students', name: 'ข้อมูลสิทธิ์และปฏิทิน', icon: <Users size={20}/> }
      ];
    } else {
      return [
        { id: 'overview', name: 'หน้าแรก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'ดูรายชื่อสถานประกอบการ', icon: <Factory size={20}/> },
        { id: 'supervise', name: 'บันทึกการนิเทศงาน', icon: <ClipboardCheck size={20}/> },
        { id: 'my_students', name: 'นักศึกษาในที่ปรึกษา', icon: <Users size={20}/> }
      ];
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
     
      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col shrink-0 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24 shrink-0">
          <div className="flex items-center gap-3">
            <RobotLogo className="w-12 h-12 drop-shadow-md" />
            {(isSidebarOpen || window.innerWidth < 768) && (
              <span className="font-black text-base uppercase tracking-tighter text-white animate-in fade-in duration-300">
                CO-OP SYSTEM ({userRole === 'student' ? 'STUDENT' : 'STAFF'})
              </span>
            )}
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute right-4 md:hidden p-2 hover:bg-white/10 rounded-xl">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {getMenuItems().map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg' : 'text-red-100/70 hover:bg-white/5'}`}>
              {item.icon}
              {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase tracking-wide">{item.name}</span>}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="p-8 flex items-center text-red-200 hover:text-white transition-colors border-t border-white/5 shrink-0">
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">LOGOUT</span>}
        </button>
      </aside>

      {/* ขอบเขตเนื้อหาหลักฝั่งขวา */}
      <main className="flex-1 flex flex-col overflow-hidden">
       
        {/* Header แถบบน */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all">
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-black text-gray-800 uppercase tracking-wide text-sm md:text-base">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h2>
          </div>
         
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">
                {userRole === 'student' ? `ST-ID: ${displayId}` : `STAFF-ID: ${displayId}`}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-red-800 uppercase bg-red-50 px-1.5 py-0.5 rounded">
                  {userRole === 'student' ? 'นักศึกษา' : userRole === 'coordinator' ? 'ผู้ประสานงาน' : 'อาจารย์นิเทศก์'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black shadow-md shadow-red-900/20">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* ส่วนกระดานบอร์ดเนื้อหาหลัก */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
           
            {activeTab === 'overview' && (
              <>
                {/* 1. ส่วนต้อนรับและข้อมูลส่วนตัวตามบทบาท */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* แบนเนอร์แดงต้อนรับ */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-black mb-2">
                      สวัสดีคุณ {displayFullName}!
                    </h3>
                    <p className="opacity-80 text-xs font-medium max-w-sm leading-relaxed">
                      {userRole === 'student'
                        ? 'ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา ตรวจสอบสถานะคำร้องและข้อมูลบริษัทชั้นนำได้ทันที'
                        : 'ระบบจัดการหลังบ้านสำหรับคณาจารย์และเจ้าหน้าที่ ตรวจสอบความถูกต้องและอนุมัติสิทธิ์นักศึกษา'}
                    </p>
                    <Factory className="absolute -right-6 -bottom-10 w-48 h-48 text-white/5 rotate-12 pointer-events-none" />
                  </div>

                  {/* การ์ดข้อมูลส่วนตัวผู้ใช้งาน */}
                  <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-red-50 text-[#800000] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        บัญชีผู้ใช้งานปัจจุบัน
                      </span>
                     
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500"><GraduationCap size={24} /></div>
                        <div>
                          <p className="text-xs font-black text-gray-800">{displayFullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold">สิทธิ์ใช้งาน: {userRole}</p>
                        </div>
                      </div>
                    </div>
                   
                    <div className="border-t border-gray-50 pt-3 mt-4 space-y-1.5 text-xs text-gray-500 font-bold">
                      {userRole === 'student' ? (
                        <>
                          <p>คณะ: <span className="text-gray-700 font-black">{profileData?.faculty || 'ไม่ระบุคณะ'}</span></p>
                          <p>สาขา: <span className="text-gray-700 font-black">{profileData?.major || 'ไม่ระบุสาขา'}</span></p>
                          <p>ภาคเรียนที่: <span className="text-[#800000] font-black">{profileData?.semester || '1'}</span></p>
                        </>
                      ) : (
                        <>
                          <p>สังกัด: <span className="text-gray-700 font-black">สาขาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์</span></p>
                          <p>สถานะการตรวจสอบ: <span className="text-green-600 font-black">Authorized Staff</span></p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. สรุปแดชบอร์ดตามบทบาทผู้ใช้งาน */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#800000]"/>
                    {userRole === 'student' ? 'สรุปสถานะคำร้องส่วนตัว' : 'ภาพรวมข้อมูลคำร้องงานในระบบทั้งหมด'}
                  </h4>
                 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 mb-1">อนุมัติเรียบร้อย</p>
                        <h5 className="text-2xl font-black text-emerald-700">{userRole === 'student' ? '2' : '45'} <span className="text-xs font-bold text-emerald-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-emerald-700 shadow-sm border-2 border-emerald-400">OK</div>
                    </div>

                    <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-amber-600 mb-1">รอการตรวจสอบ</p>
                        <h5 className="text-2xl font-black text-amber-700">{userRole === 'student' ? '1' : '12'} <span className="text-xs font-bold text-amber-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-amber-700 shadow-sm border-2 border-amber-300">WAIT</div>
                    </div>

                    <div className="p-5 bg-red-50/40 border border-red-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-red-600 mb-1">ปฏิเสธ/รอแก้ไข</p>
                        <h5 className="text-2xl font-black text-red-700">{userRole === 'student' ? '0' : '3'} <span className="text-xs font-bold text-red-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-gray-400 shadow-sm border-2 border-gray-200">0</div>
                    </div>
                  </div>
                </div>

                {/* ไทม์ไลน์จะแสดงเฉพาะฝั่งนักศึกษา */}
                {userRole === 'student' && (
                  <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                    <h4 className="text-gray-800 font-black mb-8 flex items-center gap-2">
                      <Calendar size={20} className="text-[#800000]"/> ไทม์ไลน์ขั้นตอนการดำเนินงาน (Co-op Timeline)
                    </h4>
                    <div className="relative border-l-2 border-red-100 ml-4 md:ml-6 space-y-8 pb-4">
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white p-1 rounded-full">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">เสร็จสิ้นแล้ว</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">ยื่นใบสมัครและเลือกสถานประกอบการ</h5>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-amber-400 text-white p-1 rounded-full">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-md">กำลังดำเนินงาน</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">อาจารย์และเจ้าหน้าที่ตรวจสอบคำร้อง</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'company' && <CompanyManagement />}

            {/* หน้าสลับสำหรับฝั่ง ผู้ประสานงาน (Coordinator Views) */}
            {userRole === 'coordinator' && (
              <CoordinatorManagement activeTab={activeTab} />
            )}

            {/* หน้าสลับสำหรับฝั่ง อาจารย์นิเทศก์ (Advisor Views) */}
            {userRole === 'advisor' && (
              <AdvisorManagement activeTab={activeTab} />
            )}

            {/* Fallback View สำหรับหน้าคำร้องฝั่งนักศึกษา (Static) */}
            {userRole === 'student' && activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">หน้าต่างตรวจสอบคำร้องนักศึกษา</h3>
                <p className="text-xs text-gray-400 font-bold mt-2">คำร้องของคุณกำลังอยู่ในกระบวนการพิจารณาตรวจสอบความถูกต้องโครงสร้างขององค์กร</p>
              </div>
            )}

          </div>
        </section>
      </main>
     
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;800&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
      `}} />
    </div>
  );
};

// --- 5. หน้า Login ---
const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('student'); // 'student' | 'coordinator' | 'advisor'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        username: String(username),
        password: String(password)
      };
      
      // Backend มี endpoint /login เพียงตัวเดียว
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
      } else {
        alert("ระบบได้รับข้อมูลสำเร็จ แต่ไม่พบสิทธิ์เข้าใช้งานในรูปแบบ Token");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert(`ไม่พบหน้าปลายทาง (404 Not Found):\nพาท "${error.config.url}" ไม่มีอยู่จริงในเซิร์ฟเวอร์หลังบ้าน`);
        } else if (error.response.status === 401 || error.response.status === 422) {
          alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือโครงสร้างข้อมูลไม่สมบูรณ์");
        } else {
          alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: รหัสสถานะ ${error.response.status}`);
        }
      } else {
        alert("ไม่สามารถเชื่อมต่อเครือข่ายเข้ากับเซิร์ฟเวอร์หลังบ้านได้");
      }
    } finally {
      setLoading(false);
    }
  };

  const getUsernamePlaceholder = () => {
    if (role === 'student') return "รหัสนักศึกษา";
    if (role === 'coordinator') return "ชื่อบัญชีอาจารย์ผู้ประสานงาน";
    return "ชื่อบัญชีอาจารย์นิเทศก์";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-lg border border-gray-50 text-center">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <RobotLogo className="w-18 h-18" />
        </div>
        <h1 className="text-xl font-black text-gray-800 uppercase mb-6 tracking-tighter">เข้าสู่ระบบระบบสหกิจศึกษา</h1>
        
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setRole('student'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'student' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            นักศึกษา
          </button>
          <button
            type="button"
            onClick={() => { setRole('coordinator'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'coordinator' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            ผู้ประสานงาน
          </button>
          <button
            type="button"
            onClick={() => { setRole('advisor'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'advisor' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            อาจารย์นิเทศก์
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">ชื่อบัญชีผู้ใช้งาน</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all text-sm"
              placeholder={getUsernamePlaceholder()}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">รหัสผ่านสำหรับเข้าสู่ระบบ</label>
            <input
              type="password"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#800000] text-white py-4 mt-2 rounded-2xl font-black shadow-xl hover:bg-black transition-all text-sm tracking-wider disabled:opacity-50"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบในฐานะ${role === 'student' ? 'นักศึกษา' : role === 'coordinator' ? 'ผู้ประสานงาน' : 'อาจารย์นิเทศก์'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainAppContainer;
