import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const data = req.body;

  try {
    const { error: dbError } = await supabase.from('entries').insert([data]);
    if (dbError) throw dbError;

    const rawMessage = `Chao ${data.full_name}, xac nhan: ${data.play_type} so [${data.numbers}]. Tien: ${data.amount}d. Mien ${data.region} (${data.station}).`;
    const encodedMessage = encodeURIComponent(rawMessage);
    const zaloLink = `https://zalo.me/${data.phone_zalo}`;
    const smsLink = `sms:${data.phone_zalo}?body=${encodedMessage}`;

    const emailContent = `
      <div style="font-family: sans-serif; max-width: 500px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <h2 style="color: #2563eb; text-align: center;">🔔 ĐƠN ĐĂNG KÝ MỚI</h2>
        <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <p><b>👤 Khách hàng:</b> ${data.full_name} (${data.phone_zalo})</p>
          <p><b>🎲 Loại cược:</b> <span style="color: #dc2626; font-weight: bold;">${data.play_type}</span></p>
          <p><b>🔢 Số ghi:</b> <span style="color: #dc2626; font-weight: bold; font-size: 1.2em;">${data.numbers}</span></p>
          <p><b>💰 Tiền cược:</b> ${data.amount} VNĐ</p>
          <p><b>🏆 Trúng dự kiến:</b> <span style="color: #059669; font-weight: bold;">${data.estimated_win} VNĐ</span></p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
          <p><b>📍 Khu vực:</b> Miền ${data.region}</p>
          <p><b>🏢 Đài chọn:</b> ${data.station}</p>
          <p><b>📝 Ghi chú:</b> ${data.note || 'Không'}</p>
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <a href="${zaloLink}" style="display: inline-block; background: #0068ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">💬 Nhắn Zalo</a>
          <a href="${smsLink}" style="display: inline-block; background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">📱 Gửi SMS</a>
        </div>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'LodeApp <onboarding@resend.dev>',
      to: process.env.MY_GMAIL,
      subject: `[${data.play_type}] ${data.full_name} - ${data.amount}đ`,
      html: emailContent,
    });

    if (emailError) throw new Error(emailError.message);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}