import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const data = req.body;

    try {
        // 1. Lưu vào Supabase
        const { error: dbError } = await supabase.from('entries').insert([data]);
        if (dbError) throw dbError;

        // 2. Chuẩn bị nội dung tin nhắn tự soạn (để gửi qua Zalo/SMS)
        const rawMessage = `Chao ${data.full_name}, minh xac nhan so: ${data.numbers} - Mien: ${data.region}. Ghi chu: ${data.note || 'Khong'}`;
        const encodedMessage = encodeURIComponent(rawMessage);

        // 3. Tạo link Zalo và SMS
        const zaloLink = `https://zalo.me/${data.phone_zalo}`;
        const smsLink = `sms:${data.phone_zalo}?body=${encodedMessage}`;

        // 4. Soạn giao diện Email với các nút bấm (Style bằng HTML)
        const emailContent = `
      <div style="font-family: sans-serif; max-width: 500px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <h2 style="color: #2563eb; text-align: center;">🔔 ĐƠN ĐĂNG KÝ MỚI</h2>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <p><b>👤 Khách hàng:</b> ${data.full_name}</p>
          <p><b>📞 SĐT/Zalo:</b> ${data.phone_zalo}</p>
          <p><b>🔢 Số ghi:</b> <span style="color: #dc2626; font-weight: bold; font-size: 1.2em;">${data.numbers}</span></p>
          <p><b>📍 Vùng miền:</b> Miền ${data.region}</p>
          <p><b>📝 Ghi chú:</b> ${data.note || 'Không có'}</p>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <a href="${zaloLink}" 
             style="display: inline-block; background: #0068ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
             💬 Nhắn Zalo
          </a>

          <a href="${smsLink}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
             📱 Gửi SMS
          </a>
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
          <i>Hệ thống tự động từ Web App của Văn Nho</i>
        </p>
      </div>
    `;

        // 5. Gửi Email
        await resend.emails.send({
            from: 'LodeApp <onboarding@resend.dev>',
            to: process.env.MY_GMAIL,
            subject: `[ĐƠN MỚI] ${data.full_name} - ${data.numbers}`,
            html: emailContent,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}