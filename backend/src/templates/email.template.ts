import 'dotenv/config';

export const verifyTemplate = (email: string, pin: string) => {
  return {
    from: `"QRFileDrop admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    text: `
        Hi! Enter the following verification pin to get access to the QR code files: ${pin}. QRFileDrop admin`,
    html: `
        <div style='font-family: system-ui, -apple-system, sans-serif, Arial'>
        <p>Hi!</p>
        <p>Enter the following verification pin to get access to the qrcode files:</p>
        <p style='
        font-family: monospace, Courier;
        letter-spacing: 5px;
        border: 1px solid black;
        width: fit-content;
        padding: 5px;'>${pin}</p>
        <p>QRFileDrop admin</p>
        </div>`,
  };
};
export const filesTemplate = (email: string, fileName: string, fileURL: string) => {
  return {
    from: `"QRFileDrop admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'QR code files',
    text: `
        Hi! Here are the QR code files. Thanks for using QRFileDrop <3.`,
    html: `
        <div style='font-family: system-ui, -apple-system, sans-serif, Arial'>
        <p>Hi!</p>
        <p>Here are the QR code files.</p>
        <p style='margin-top:20px'>Thanks for using QRFileDrop <3.</p>
        </div>`,
    attachments: [
      {
        filename: `${fileName}`,
        path: `${fileURL}`,
      },
    ],
  };
};
