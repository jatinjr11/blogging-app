import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Transporter ko ek baar hi create kar lete hain
console.log({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  user: process.env.EMAIL_USER,
});
const transport = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // convert to boolean
  auth: {
    user: "jatin333x@gmail.com",
    pass: "yniq qoke meqe ubva",
  },
  
});

// OTP verification ke liye mail bhejne wala function
const sendMail = async (email, subject, data) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OTP Verification</title>
    <style>
        body { font-family: Arial, sans-serif; margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh; }
        .container { background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center; }
        h1 { color: red; }
        p { margin-bottom:20px; color:#666; }
        .otp { font-size:36px; color:#7b68ee; margin-bottom:30px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name}, your One-Time Password (OTP) for account verification is:</p>
        <p class="otp">${data.otp}</p>
    </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject,
    text: `Hello ${data.name}, your OTP for account verification is ${data.otp}`, // text fallback
    html,
  });
};

// Password reset ke liye OTP bhejne wala function
const sendForgotMail = async (subject, data) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Reset OTP</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f3f3f3; padding:20px; }
    .container { background:#fff; padding:30px; max-width:600px; margin:auto; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
    h2 { color:#5a2d82; }
    p { font-size:16px; color:#555; }
    .otp { font-size:28px; font-weight:bold; color:#5a2d82; margin:20px 0; text-align:center; letter-spacing:4px; }
    .footer { margin-top:30px; font-size:14px; text-align:center; color:#aaa; }
  </style>
</head>
<body>
  <div class="container">
    <h2>OTP to Reset Your Password</h2>
    <p>Hello,</p>
    <p>You requested to reset your password. Use this OTP:</p>
    <div class="otp">${data.otp}</div>
    <p>This OTP is valid for 5 minutes. Agar aapne ye request nahi kiya hai, toh ignore kar dena.</p>
    <div class="footer">
      <p>© ${new Date().getFullYear()} E-Learning Platform</p>
    </div>
  </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.GMAIL_EMAIL,
    to: data.email,
    subject,
    text: `Your OTP to reset password is ${data.otp}. Valid for 5 minutes.`,
    html,
  });
};

export default sendMail;
export { sendForgotMail };
