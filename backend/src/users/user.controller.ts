import { Request, Response } from 'express';
import { Qrcode } from '../qrcodes/qrcode.model';

export async function getMyQrcodes(req: Request, res: Response): Promise<void> {
  try {
    const qrcodes = await Qrcode.find({ user: req.payload.user });
    res.status(200).json({ success: true, message: 'qrcodes found', data: [qrcodes] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}
