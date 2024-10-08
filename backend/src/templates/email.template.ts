import 'dotenv/config';

export const verifyTemplate = (email: string, pin: string) => {
  return {
    from: `"QrFileDrop admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    text: `
        Hi! Enter the following verification pin to get access to the QR code files: ${pin}. If you didn't request access to files by scanning a qr code, please kindly ignore this email.`,
    html: `
        <div style='font-family: system-ui, -apple-system, sans-serif, Arial'>
        <h2>Hi!</h2>
        <p>Enter the following verification pin to get access to the qrcode files:</p>
        <p style='
        font-family: monospace, Courier;
        letter-spacing: 5px;
        border: 1px solid black;
        width: fit-content;
        padding: 5px;'>${pin}</p>
        <p>If you didn't request access to files by scanning a QR code, please kindly ignore this email.</p>
        </div>`,
  };
};
export const filesTemplate = (email: string) => {
  return {
    from: `"QrFileDrop admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Files',
    text: `
        Hi! Here are the qrcode files.`,
    html: `
        <div style='font-family: system-ui, -apple-system, sans-serif, Arial'>
        <h2>Hi!</h2>
        <p>Here are the qrcode files.</p>
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
