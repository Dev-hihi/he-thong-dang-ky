import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Phone, User, Hash, MapPin, FileText, Send, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// --- TỪ ĐIỂN LỊCH XỔ SỐ ---
const LOTTERY_SCHEDULE = {
  0: { dayName: "Chủ Nhật", Bac: ["Thái Bình"], Trung: ["Khánh Hòa", "Kon Tum"], Nam: ["Tiền Giang", "Kiên Giang", "Đà Lạt"] },
  1: { dayName: "Thứ 2", Bac: ["Hà Nội"], Trung: ["Thừa Thiên Huế", "Phú Yên"], Nam: ["TP.HCM", "Đồng Tháp", "Cà Mau"] },
  2: { dayName: "Thứ 3", Bac: ["Quảng Ninh"], Trung: ["Đắk Lắk", "Quảng Nam"], Nam: ["Bến Tre", "Vũng Tàu", "Bạc Liêu"] },
  3: { dayName: "Thứ 4", Bac: ["Bắc Ninh"], Trung: ["Đà Nẵng", "Khánh Hòa"], Nam: ["Đồng Nai", "Cần Thơ", "Sóc Trăng"] },
  4: { dayName: "Thứ 5", Bac: ["Hà Nội"], Trung: ["Bình Định", "Quảng Trị", "Quảng Bình"], Nam: ["Tây Ninh", "An Giang", "Bình Thuận"] },
  5: { dayName: "Thứ 6", Bac: ["Hải Phòng"], Trung: ["Gia Lai", "Ninh Thuận"], Nam: ["Vĩnh Long", "Bình Dương", "Trà Vinh"] },
  6: { dayName: "Thứ 7", Bac: ["Nam Định"], Trung: ["Đà Nẵng", "Quảng Ngãi", "Đắk Nông"], Nam: ["TP.HCM", "Long An", "Bình Phước", "Hậu Giang"] }
};

export default function UserFormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy thứ mấy của ngày hôm nay
  const todayIndex = new Date().getDay();
  const currentSchedule = LOTTERY_SCHEDULE[todayIndex];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    numbers: '',
    region: 'Miền Bắc',
    station: currentSchedule['Bac'][0], // Đài mặc định ban đầu
    note: ''
  });

  // Tự động đổi đài khi khách bấm chọn Miền khác
  useEffect(() => {
    const regionKey = formData.region === 'Miền Bắc' ? 'Bac' : formData.region === 'Miền Trung' ? 'Trung' : 'Nam';
    const stationsForToday = currentSchedule[regionKey];
    if (stationsForToday && stationsForToday.length > 0) {
      setFormData(prev => ({ ...prev, station: stationsForToday[0] }));
    }
  }, [formData.region]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.numbers || !formData.station) {
      alert('Vui lòng điền đầy đủ thông tin và chọn đài!');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone_zalo: formData.phone,
          numbers: formData.numbers,
          region: formData.region.replace('Miền ', ''),
          station: formData.station, // Gửi tên đài lên mạng
          note: formData.note
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setFormData({
          fullName: '',
          phone: '',
          numbers: '',
          region: 'Miền Bắc',
          station: currentSchedule['Bac'][0],
          note: ''
        });
      } else {
        alert('Có lỗi từ hệ thống, vui lòng thử lại sau.');
      }
    } catch (error) {
      alert('Lỗi kết nối. Vui lòng kiểm tra mạng!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng Ký Thông Tin</h1>
            <p className="text-gray-500 text-sm">Vui lòng nhập đầy đủ thông tin bên dưới để đăng ký.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2"><User size={14} className="text-blue-600" />Họ và Tên</label>
              <input type="text" required placeholder="Nhập họ và tên của bạn" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2"><Phone size={14} className="text-blue-600" />Số Điện Thoại / Zalo</label>
              <input type="tel" required pattern="[0-9]*" placeholder="Ví dụ: 0901234567" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} />
            </div>

            {/* ĐÃ NÂNG CẤP: CHỈ CHO NHẬP SỐ */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2"><Hash size={14} className="text-blue-600" />Số lượng đăng ký</label>
              <input
                type="tel"
                pattern="[0-9]*"
                required
                placeholder="Ví dụ: 10, 25, 45"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                value={formData.numbers}
                onChange={(e) => setFormData({ ...formData, numbers: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2"><MapPin size={14} className="text-blue-600" />Khu vực</label>
              <div className="grid grid-cols-3 gap-2">
                {['Miền Bắc', 'Miền Trung', 'Miền Nam'].map((r) => (
                  <button key={r} type="button" onClick={() => setFormData({ ...formData, region: r })} className={cn("py-2.5 text-sm rounded-xl border transition-all font-medium", formData.region === r ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50")}>{r}</button>
                ))}
              </div>
            </div>

            {/* --- KHU VỰC CHỌN ĐÀI XỔ SỐ --- */}
            <div className="space-y-2 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <Calendar size={16} /> Hôm nay ({currentSchedule.dayName}). Chọn đài:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSchedule[formData.region === 'Miền Bắc' ? 'Bac' : formData.region === 'Miền Trung' ? 'Trung' : 'Nam'].map((stationName) => (
                  <label key={stationName} className={`cursor-pointer px-4 py-2 rounded-md border text-sm font-medium transition-all ${formData.station === stationName ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'}`}>
                    <input type="radio" name="station" value={stationName} className="hidden" onChange={(e) => setFormData({ ...formData, station: e.target.value })} />
                    {stationName}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2"><FileText size={14} className="text-blue-600" />Ghi chú</label>
              <textarea rows={3} placeholder="Nhập thêm thông tin nếu có..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-none" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
            </div>

            <button type="submit" disabled={isLoading} className={cn("w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]", isLoading && "opacity-70 cursor-not-allowed")}>
              {isLoading ? 'Đang xử lý...' : 'Gửi Đăng Ký'} {!isLoading && <Send size={18} />}
            </button>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800">
              <div className="bg-green-500 p-1 rounded-full"><CheckCircle2 size={18} className="text-white" /></div>
              <div><p className="font-bold text-sm">Thành công!</p><p className="text-xs text-gray-400">Thông tin đã được gửi đi.</p></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}