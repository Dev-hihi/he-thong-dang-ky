import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Download,
  Filter,
  Calendar,
  Database,
  Search,
  Bell,
  Menu,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';
import { format, isToday } from 'date-fns';

export default function AdminDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterToday, setFilterToday] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setEntries(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = entries.filter(item => {
    const matchesSearch =
      item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_zalo?.includes(searchQuery) ||
      item.numbers?.includes(searchQuery); // Cho phép tìm theo số đánh

    const matchesToday = filterToday ? isToday(new Date(item.created_at)) : true;

    return matchesSearch && matchesToday;
  });

  const totalToday = entries.filter(item => isToday(new Date(item.created_at))).length;
  const totalAllTime = entries.length;

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // NÂNG CẤP: Thêm các cột mới vào file Excel
    const dataToExport = filteredData.map(item => ({
      'ID': item.id.split('-')[0],
      'Thời gian': format(new Date(item.created_at), 'dd/MM/yyyy HH:mm'),
      'Họ tên': item.full_name,
      'SĐT/Zalo': item.phone_zalo,
      'Loại cược': item.play_type || 'Bao Lô',
      'Số đánh': item.numbers,
      'Khu vực': `Miền ${item.region.replace('Miền ', '')}`,
      'Đài chọn': item.station || '',
      'Tiền cược (VNĐ)': item.amount || '0',
      'Trúng dự kiến (VNĐ)': item.estimated_win || '0',
      'Ghi chú': item.note || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSach");

    const fileName = `DanhSach_${filterToday ? 'HomNay_' : ''}${format(new Date(), 'dd_MM_yyyy')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">Đang tải dữ liệu hệ thống...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Database size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Admin Panel</span>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Tổng quan" active />
            <NavItem icon={<Users size={18} />} label="Danh sách đăng ký" />
            <NavItem icon={<Calendar size={18} />} label="Lịch trình" />
            <NavItem icon={<Database size={18} />} label="Dữ liệu hệ thống" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors w-full rounded-xl hover:bg-red-50">
              <LogOut size={18} />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm tên, SĐT, số đánh..."
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-80 focus:ring-2 focus:ring-blue-500/10 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-slate-500">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Bảng Điều Khiển</h2>
              <p className="text-slate-500 text-sm">Quản lý danh sách đăng ký hệ thống.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterToday(!filterToday)}
                className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all", filterToday ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}
              >
                <Filter size={16} /> Lọc hôm nay
              </button>
              <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 border border-transparent rounded-xl text-sm font-semibold text-white hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                <Download size={16} /> Xuất Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Đăng ký hôm nay" value={totalToday} color="blue" icon={<Calendar size={20} />} />
            <StatCard label="Tổng đăng ký" value={totalAllTime} color="indigo" icon={<Users size={20} />} />
            <StatCard label="Lượt tìm kiếm" value={searchQuery ? "Đang lọc" : "-"} color="emerald" icon={<Search size={20} />} />
            <StatCard label="Trạng thái DB" value="Online" color="amber" icon={<Database size={20} />} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Danh Sách Đăng Ký</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredData.length} kết quả</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khu vực / Đài</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loại Cược</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số Đánh</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tiền Cược</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Trúng Dự Kiến</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">

                      {/* Khách hàng */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{item.full_name}</div>
                        <div className="text-slate-500 text-xs">{item.phone_zalo}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">{format(new Date(item.created_at), 'dd/MM/yy HH:mm')}</div>
                      </td>

                      {/* Khu vực / Đài */}
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-800">Miền {item.region.replace('Miền ', '')}</div>
                        <div className="text-slate-500 text-xs truncate max-w-[150px]" title={item.station}>{item.station}</div>
                      </td>

                      {/* Loại cược */}
                      <td className="px-4 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                          item.play_type === 'Xiên 2 (Đá)' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {item.play_type || 'Bao Lô'}
                        </span>
                      </td>

                      {/* Số đánh */}
                      <td className="px-4 py-4">
                        <span className="font-bold text-red-600 text-base">{item.numbers}</span>
                      </td>

                      {/* Tiền cược */}
                      <td className="px-4 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {item.amount ? `${item.amount} ₫` : '-'}
                      </td>

                      {/* Trúng dự kiến */}
                      <td className="px-4 py-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                        {item.estimated_win ? `${item.estimated_win} ₫` : '-'}
                      </td>

                      {/* Ghi chú */}
                      <td className="px-4 py-4 text-sm text-slate-500 max-w-[120px] truncate" title={item.note}>
                        {item.note || '-'}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database size={24} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Chưa có dữ liệu nào phù hợp.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={cn("flex items-center justify-between px-4 py-3 rounded-xl transition-all group", active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}>
      <div className="flex items-center gap-3">{icon}<span className="font-semibold text-sm">{label}</span></div>
      {active && <ChevronRight size={14} />}
    </a>
  );
}

function StatCard({ label, value, color, icon }: { label: string, value: string | number, color: string, icon: React.ReactNode }) {
  const colorMap: Record<string, string> = { blue: "bg-blue-50 text-blue-600", indigo: "bg-indigo-50 text-indigo-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600" };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4"><div className={cn("p-2.5 rounded-xl", colorMap[color])}>{icon}</div></div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}