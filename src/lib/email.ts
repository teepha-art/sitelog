import nodemailer from 'nodemailer';
import { env } from './env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT, 10),
  secure: env.SMTP_PORT === '465',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, code: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Password Reset</h2>
      <p>You requested a password reset for your SiteLog account.</p>
      <p>Your 6-digit reset code is:</p>
      <h3 style="font-size: 24px; letter-spacing: 2px; padding: 10px; background: #f4f4f5; display: inline-block; border-radius: 4px;">${code}</h3>
      <p>This code will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"SiteLog" <${env.SMTP_FROM}>`,
    to,
    subject: 'SiteLog Password Reset Code',
    text: `Your SiteLog password reset code is: ${code}. It expires in 15 minutes.`,
    html,
  });
}
