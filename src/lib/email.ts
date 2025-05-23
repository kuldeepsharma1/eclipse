import {createTransport} from 'nodemailer'

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
 secure: false,
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email address",
    html: `
      <div>
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset your password",
    html: `
      <div>
        <h1>Password Reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  });
};
