import 'dotenv/config';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PW,
  },
});

interface EmailTemplate {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export async function sendEmail(template: EmailTemplate) {
  const result = await transport.sendMail(template);
  console.log({ result });
  return result;
}
