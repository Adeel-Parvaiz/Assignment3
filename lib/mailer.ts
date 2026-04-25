import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to:      string;
  subject: string;
  html:    string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  await transporter.sendMail({
    from:    `"Property CRM" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}