import { Qrcode } from './qrcode.model';
import { Request, Response } from 'express';
import QrCode from 'qrcode';
import { v4 } from 'uuid';
import { createSalt, createHash, createNumericalCode } from '../auth/auth.service';
import { sendEmail } from '../email/email.config';
import { verifyTemplate, filesTemplate } from '../email/email.template';
import { User } from '../users/user.model';

export async function createQrcode(req: Request, res: Response): Promise<void> {
  const { count, pincode, expiresIn } = req.body as { count: number; pincode: boolean; expiresIn: number };
  // count: zeit im minuten
  //   console.log({ req });

  console.log('req.body', req.body);
  console.log('req.payload', req.payload);

  //! erstmal nur für count = 1

  const salt = createSalt();
  const slug = v4();
  console.log({ salt, slug });

  const expiresAt = Date.now() + expiresIn * 60 * 1000;

  try {
    const dataURL = await QrCode.toDataURL(`https://qr-file-drop.onrender.com/qr-code/${slug}`, {
      width: 300,
    });

    const qrcode = new Qrcode({
      dataURL,
      user: req.payload.user,
      slug,
      salt,
      expiresAt,
    });
    await qrcode.save();

    res.status(201).json({ success: true, message: 'qrcode created', data: { dataURL, expiresAt, slug } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function verifyQrcode(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;

  console.log({ slug });

  try {
    const qrcode = await Qrcode.findOne({ slug });
    if (!qrcode) {
      res.status(404).json({ success: false, message: 'qrcode not found' });
      return;
    }
    let now = Date.now();
    console.log({ now });

    if (qrcode) {
      const expiryDate = new Date(qrcode.expiresAt).getTime();
      console.log({ expiryDate });

      if (expiryDate < now) {
        res.status(404).json({ success: false, message: 'qrcode expired' });
        return;
      }

      const user = await User.findById(qrcode.user);
      if (!user) {
        res.status(404).json({ success: false, message: 'qr code creator not found' });
      }
      const username = user.displayName ? user.displayName : user.email;
      res.status(200).json({ success: true, message: 'qrcode valid', data: { username } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const { email } = req.body;

  console.log({ slug, email });

  try {
    const qrcode = await Qrcode.findOne({ slug });

    console.log({ qrcode });
    if (!qrcode) {
      res.status(404).json({ success: false, message: 'qrcode not found' });
      return;
    }
    if (qrcode) {
      const pin = createNumericalCode(6);
      const hashedPin = createHash(pin, qrcode.salt);
      const updateResult = await qrcode.updateOne({
        pin: hashedPin,
        scanned: true,
        scannedBy: email,
        scannedAt: Date.now(),
      });
      // console.log({ updateResult });
      if (updateResult.modifiedCount === 0) {
        res.status(404).json({ success: false, message: 'qrcode registration failed' });
        return;
      }
      const emailResult = await sendEmail(verifyTemplate(email, pin));
      if (emailResult.accepted.length === 0) {
        res
          .status(404)
          .json({ success: false, message: 'email could not be delivered to address', data: emailResult.rejected });
      }
      if (updateResult.modifiedCount > 0 && emailResult.accepted.length > 0) {
        res.status(200).json({ success: true, message: 'qr code updated and email sent successfully' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function getFile(req: Request, res: Response): Promise<void> {
  console.log('payload', req.payload);

  try {
    const user = await User.findById(req.payload.user_id);
    console.log({ user });

    if (!user) {
      res.status(404).json({ success: false, message: 'user not found' });
      return;
    }
    const files = user.files;
    if (!files) {
      res.status(404).json({ success: false, message: 'files not found' });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: 'files sent', data: { files: files, email: req.payload.scannedBy } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function sendFiles(req: Request, res: Response): Promise<void> {
  console.log('payload', req.payload);

  try {
    const user = await User.findById(req.payload.user_id);
    console.log({ user });

    if (!user) {
      res.status(404).json({ success: false, message: 'user not found' });
      return;
    }
    const files = user.files;
    if (!files) {
      res.status(404).json({ success: false, message: 'files not found' });
      return;
    }

    sendEmail(filesTemplate(req.payload.scannedBy, files[0].fileName, files[0].fileURL));
    res.status(200).json({ success: true, message: 'files sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}
