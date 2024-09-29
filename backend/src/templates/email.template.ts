import 'dotenv/config';

export const testTemplate = () => {
  return {
    from: process.env.GMAIL_USER,
    to: 'receiver@mail.com',
    subject: 'Nodemailer',
    text: `
        Lorem ipsum dolor sit amet consectetur adipisicing elit.`,
    html: `
        <div style='font-family: system-ui, -apple-system, sans-serif, Arial'>
        <h2>Lorem</h2>
        <p>ipsum dolor sit amet consectetur adipisicing elit.</p>            
        </div>`,
    attachments: [
      {
        filename: 'document.pdf',
        path: '/path/to/document.pdf',
      },
    ],
  };
};

//
// import { sendEmail } from 'config/email.config';
// sendEmail(testTemplate());
