import { Qrcode } from './qrcode.model';
import { Request, Response } from 'express';
import QrCode from 'qrcode';
import { v4 } from 'uuid';
import { createSalt, createHash } from '../auth/auth.service';

export async function createQrcode(req: Request, res: Response): Promise<void> {
  const { count, secure, expiresIn } = req.body as { count: number; secure: boolean; expiresIn: number };
  // zeit im minuten
  //   console.log({ req });

  console.log('req.body', req.body);

  // &count=1&code=true
  // erstmal nur für count = 1

  const salt = createSalt();
  const slug = v4();
  console.log({ salt, slug });

  const expiresAt = Date.now() + expiresIn * 60 * 1000;

  try {
    const dataURL = await QrCode.toDataURL(`http://192.168.1.9:9999/qr-code/${slug}`);
    //   console.log(dataURL);
    if (secure) {
      // pin muss vorher vom user festgelegt werden
      //   const pin = req.payload.pin;
      const pin = '1234';
      const hashedPin = createHash(pin, salt);

      const qrcode = new Qrcode({
        dataURL,
        slug,
        pin: hashedPin,
        salt,
        expiresAt,
      });
      await qrcode.save();
    } else {
      const qrcode = new Qrcode({
        dataURL,
        slug,
        salt,
        expiresAt,
      });
      await qrcode.save();
    }

    res.status(201).json({ success: true, message: 'qrcode created', data: { dataURL, expiresAt } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function verifyQrcode(req: Request, res: Response): Promise<void> {
  res.end();
}

export async function getQrcodes(req: Request, res: Response): Promise<void> {
  try {
    const qrcodes = await Qrcode.find();
    res.status(200).json({ success: true, message: 'qrcode created', data: [qrcodes] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}
