const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✅ Root Route (fix Cannot GET /)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ✅ Gmail configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sonalkmore06@gmail.com',       // 🔴 Your Gmail
    pass: 'xlbr zflw hjkf vceo'        // 🔴 App Password
    
  }
});

// 📩 Send Email API
app.post('/send-enquiry', async (req, res) => {
  const { name, phone, email, company, product, quantity, size_grade, message } = req.body;

  if (!name || !phone) {
    return res.json({ success: false, message: 'Name & Phone required' });
  }

  try {
    const mailOptions = {
      from: 'sonalkmore06@gmail.com',
      to: 'sonalkmore06@gmail.com',
      subject: `New Enquiry from ${name} – Valaki Enterprise`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
          <div style="background:#0066CC;padding:24px 30px">
            <h2 style="color:#fff;margin:0;font-size:1.4rem">New Product Enquiry</h2>
            <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:0.85rem">Valaki Enterprise – Website Contact Form</p>
          </div>
          <div style="padding:30px">
            <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
              <tr style="background:#f4f6f9"><td style="padding:10px 14px;font-weight:700;width:38%;color:#1A2332">Name</td><td style="padding:10px 14px;color:#3D4F6E">${name}</td></tr>
              <tr><td style="padding:10px 14px;font-weight:700;color:#1A2332">Phone</td><td style="padding:10px 14px;color:#3D4F6E">${phone}</td></tr>
              <tr style="background:#f4f6f9"><td style="padding:10px 14px;font-weight:700;color:#1A2332">Email</td><td style="padding:10px 14px;color:#3D4F6E">${email || 'Not provided'}</td></tr>
              <tr><td style="padding:10px 14px;font-weight:700;color:#1A2332">Company</td><td style="padding:10px 14px;color:#3D4F6E">${company || 'Not provided'}</td></tr>
              <tr style="background:#f4f6f9"><td style="padding:10px 14px;font-weight:700;color:#1A2332">Product Interest</td><td style="padding:10px 14px;color:#0066CC;font-weight:600">${product || 'Not specified'}</td></tr>
              <tr><td style="padding:10px 14px;font-weight:700;color:#1A2332">Quantity</td><td style="padding:10px 14px;color:#3D4F6E">${quantity || 'Not specified'}</td></tr>
              <tr style="background:#f4f6f9"><td style="padding:10px 14px;font-weight:700;color:#1A2332">Size / Grade</td><td style="padding:10px 14px;color:#3D4F6E">${size_grade || 'Not specified'}</td></tr>
              <tr><td style="padding:10px 14px;font-weight:700;color:#1A2332;vertical-align:top">Message</td><td style="padding:10px 14px;color:#3D4F6E">${message || 'No additional message'}</td></tr>
            </table>
          </div>
          <div style="background:#f4f6f9;padding:16px 30px;font-size:0.78rem;color:#6B7A99;border-top:1px solid #e0e6f0">
            This enquiry was submitted via the Valaki Enterprise website product page.
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// 🚀 Start Server
app.listen(5000, () => {
  console.log('Server running 👉 http://localhost:5000');
});