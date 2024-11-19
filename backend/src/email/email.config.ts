import 'dotenv/config';
import nodemailer from 'nodemailer';

// $ GMAIL ---- production
const transport_PROD = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PW,
  },
});

// $ MAILTRAP ---- development
const transport_DEV = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PW,
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
  const transport = process.env.NODE_ENV === 'PRODUCTION' ? transport_PROD : transport_DEV;
  const result = await transport.sendMail(template);
  console.log('result: ', { accepted: result.accepted, rejected: result.rejected, response: result.response });
  return result;
}
