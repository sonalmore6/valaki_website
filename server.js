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
    user: 'valakient@gmail.com',       // 🔴 Your Gmail
    pass: 'orel kwhm ikzw ooqw'        // 🔴 App Password
    
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
        from: `"Valaki Enterprise Enquiry" <valakient@gmail.com>`,  // Gmail forces this
  to: 'valakient@gmail.com',
  replyTo: email ? `"${name}" <${email}>` : 'valakient@gmail.com',  // ✅ User's email here
  subject: `New Enquiry from ${name} (${email || phone}) – Valaki Enterprise`,
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
    // ✅ Mail 2 - Thank You mail to User
    if (email) {
      const thankYouMail = {
        from: `"Valaki Enterprise" <valakient@gmail.com>`,
        to: email,
        subject: `Thank You for Your Enquiry – Valaki Enterprise`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
            <div style="background:#0066CC;padding:24px 30px">
              <h2 style="color:#fff;margin:0;font-size:1.4rem">Thank You, ${name}! 🙏</h2>
              <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:0.85rem">Valaki Enterprise – Enquiry Confirmation</p>
            </div>
            <div style="padding:30px;color:#3D4F6E">
              <p style="font-size:1rem">Dear <strong>${name}</strong>,</p>
              <p style="font-size:0.95rem;line-height:1.6">
                Thank you for reaching out to <strong>Valaki Enterprise</strong>.
                We have successfully received your enquiry regarding
                <strong style="color:#0066CC">${product || 'our products'}</strong>.
              </p>
              <div style="background:#f0f7ff;border-left:4px solid #0066CC;padding:16px 20px;border-radius:4px;margin:20px 0">
                <p style="margin:0;font-size:0.95rem;color:#1A2332">
                  ⏱️ Our team will get back to you within <strong>24 hours</strong>.
                </p>
              </div>
              <p style="font-size:0.9rem;font-weight:700;color:#1A2332">Your Enquiry Summary:</p>
              <table style="width:100%;border-collapse:collapse;font-size:0.88rem">
                <tr style="background:#f4f6f9">
                  <td style="padding:8px 14px;font-weight:700;width:40%;color:#1A2332">Product Interest</td>
                  <td style="padding:8px 14px;color:#0066CC;font-weight:600">${product || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 14px;font-weight:700;color:#1A2332">Quantity</td>
                  <td style="padding:8px 14px;color:#3D4F6E">${quantity || 'Not specified'}</td>
                </tr>
                <tr style="background:#f4f6f9">
                  <td style="padding:8px 14px;font-weight:700;color:#1A2332">Size / Grade</td>
                  <td style="padding:8px 14px;color:#3D4F6E">${size_grade || 'Not specified'}</td>
                </tr>
              </table>
              <p style="font-size:0.9rem;margin-top:24px;line-height:1.6">
                For urgent queries, feel free to contact us directly at
                <a href="mailto:valakient@gmail.com" style="color:#0066CC">valakient@gmail.com</a>
              </p>
              <p style="font-size:0.9rem;margin:0">Warm regards,<br>
                <strong>Valaki Enterprise Team</strong>
              </p>
            </div>
            <div style="background:#f4f6f9;padding:16px 30px;font-size:0.78rem;color:#6B7A99;border-top:1px solid #e0e6f0">
              This is an automated confirmation email. Please do not reply to this email.
            </div>
          </div>
        `
      };
      await transporter.sendMail(thankYouMail);
    }

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