// email.ts
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: false,
});

const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    }
    
    body {
      background-color: #f7f7f7;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
      padding: 32px 24px;
      text-align: center;
    }
    
    .logo {
      max-width: 180px;
      height: auto;
    }
    
    .content {
      padding: 40px 32px;
      text-align: center;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #4a4a4a;
      margin-bottom: 24px;
    }
    
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .footer {
      background-color: #f7f7f7;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b6b6b;
    }
    
    .footer a {
      color: #1a1a1a;
      text-decoration: none;
      font-weight: 600;
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 0 10px;
      }
      
      .content {
        padding: 24px 16px;
      }
      
      h1 {
        font-size: 20px;
      }
      
      p {
        font-size: 14px;
      }
      
      .btn {
        padding: 12px 24px;
        font-size: 14px;
      }
    }
  </style>
`;

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify Your Eclipse Fashion Account',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://eclipse-fashion.com/logo.png" alt="Eclipse Fashion Logo" class="logo">
          </div>
          <div class="content">
            <h1>Welcome to Eclipse Fashion</h1>
            <p>Thank you for joining our community. Please verify your email address to unlock exclusive access to our latest collections and offers.</p>
            <a href="${verificationUrl}" class="btn">Verify Your Email</a>
            <p>This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Eclipse Fashion. All rights reserved.<br>
            <a href="https://eclipse-fashion.com">Visit our website</a> | <a href="https://eclipse-fashion.com/support">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset Your Eclipse Fashion Password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        ${emailStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://eclipse-fashion.com/logo.png" alt="Eclipse Fashion Logo" class="logo">
          </div>
          <div class="content">
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password. Click the button below to set a new password for your Eclipse Fashion account.</p>
            <a href="${resetUrl}" class="btn">Reset Your Password</a>
            <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Eclipse Fashion. All rights reserved.<br>
            <a href="https://eclipse-fashion.com">Visit our website</a> | <a href="https://eclipse-fashion.com/support">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};