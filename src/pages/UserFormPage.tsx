import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Phone, User, Hash, MapPin, FileText, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function UserFormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    numbers: '',
    region: 'Miền Bắc',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate cơ bản
    if (!formData.fullName || !formData.phone || !formData.numbers) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    setIsLoading(true); // Bắt đầu trạng thái gửi

    try {
      // Gọi API thực tế
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone_zalo: formData.phone,
          numbers: formData.numbers,
          region: formData.region.replace('Miền ', ''), // Cắt chữ "Miền" cho gọn trong DB
          note: formData.note
        }),
      });

      if (response.ok) {
        // Gửi thành công thì hiện popup animation của bạn
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);

        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          numbers: '',
          region: 'Miền Bắc',
          note: ''
        });
      } else {
        alert('Có lỗi từ hệ thống, vui lòng thử lại sau.');
      }
    } catch (error) {
      alert('Lỗi kết nối. Vui lòng kiểm tra mạng!');
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fa] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng Ký Thông Tin</h1>
            <p className="text-gray-500 text-sm">Vui lòng nhập đầy đủ thông tin bên dưới để đăng ký.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                Họ và Tên
              </label>
              <input
                type="text"
                required
                placeholder="Nhập họ và tên của bạn"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} className="text-blue-600" />
                Số Điện Thoại / Zalo
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]*"
                placeholder="Ví dụ: 0901234567"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            {/* Numbers */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Hash size={14} className="text-blue-600" />
                Số lượng đăng ký
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 10, 25, 45"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
                value={formData.numbers}
                onChange={(e) => setFormData({ ...formData, numbers: e.target.value })}
              />
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} className="text-blue-600" />
                Khu vực
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Miền Bắc', 'Miền Trung', 'Miền Nam'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, region: r })}
                    className={cn(
                      "py-2.5 text-sm rounded-xl border transition-all font-medium",
                      formData.region === r
                        ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                        : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} className="text-blue-600" />
                Ghi chú
              </label>
              <textarea
                rows={3}
                placeholder="Nhập thêm thông tin nếu có..."
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]",
                isLoading && "opacity-70 cursor-not-allowed" // Làm mờ nút khi đang load
              )}
            >
              {isLoading ? 'Đang xử lý...' : 'Gửi Đăng Ký'}
              {!isLoading && <Send size={18} />}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Success Toast (Của bạn làm rất đẹp nên mình giữ nguyên) */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800">
              <div className="bg-green-500 p-1 rounded-full">
                <CheckCircle2 size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Thành công!</p>
                <p className="text-xs text-gray-400">Thông tin của bạn đã được gửi đi.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}