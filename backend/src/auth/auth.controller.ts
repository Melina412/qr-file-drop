import { Request, Response } from 'express';
import { createSalt, createHash, createToken } from './auth.service';
import { User } from '../users/user.model';
import { Qrcode } from '../qrcodes/qrcode.model';

export async function register(req: Request, res: Response): Promise<void> {
  // console.log('req.body ', req.body);
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'email already exists in db' });
      return;
    }

    const salt = createSalt();
    const hashedPassword = createHash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      salt: salt,
    });

    await user.save();
    res.status(201).json({ success: true, message: 'user created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  // console.log({ email });

  try {
    const user = await User.findOne({ email });
    // console.log({ user });
    if (!user) {
      res.status(401).json({ success: false, message: 'login failed: wrong login data' });
      return;
    }

    if (user.password !== createHash(password, user.salt)) {
      res.status(401).json({ success: false, message: 'login failed: wrong login data' });
      return;
    }

    const payload = { user: user._id, email: user.email };
    const accessToken = createToken(payload, '1h');
    const refreshToken = createToken(payload, '24h');

    //# cookies -----------------------------------------------------------
    res
      .cookie('accessCookie', accessToken, {
        httpOnly: true,
        secure: true, //! secure für safari test rausnehmen
        // sameSite: 'none',
      })
      .cookie('refreshCookie', refreshToken, {
        httpOnly: true,
        secure: true,
        // sameSite: 'none',
      })
      .json({
        success: true,
        message: 'login successful',
        data: { email: user.email },
      });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie('accessCookie').clearCookie('refreshCookie').json({ success: true, message: 'logout successful' });
}

export function protector(req: Request, res: Response): void {
  const exp = req.payload.exp;
  const expDate = new Date(exp * 1000);
  // console.log('token exp: ', expDate.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }));

  res.json(exp);
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { email } = req.payload;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'user not found' });
      return;
    }

    const payload = { user: user._id, email: user.email };
    const accessToken = createToken(payload, '1h');

    //# cookies -----------------------------------------------------------
    res
      .cookie('accessCookie', accessToken, {
        httpOnly: true,
        secure: true, //! secure für safari test rausnehmen
        // sameSite: 'none',
      })
      .json({
        success: true,
        message: 'refresh successful',
        data: { email: user.email },
      });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

export async function verifyPin(req: Request, res: Response): Promise<void> {
  const { slug, pin } = req.body;
  // const { pin } = req.body;
  console.log({ slug, pin });

  try {
    const qrcode = await Qrcode.findOne({ slug });
    if (!qrcode) {
      res.status(404).json({ success: false, message: 'qrcode not found' });
      return;
    }
    // console.log({ qrcode });

    const enteredPin = createHash(pin, qrcode.salt);
    console.log('enteredPin', enteredPin);
    console.log('qrcode.pin', qrcode.pin);

    if (enteredPin === qrcode.pin) {
      const payload = { slug: slug, user_id: qrcode.user, scannedBy: qrcode.scannedBy };
      const qrCodeToken = createToken(payload, '30min');
      //# cookies -----------------------------------------------------------
      res
        .status(200)
        .cookie('qrCodeCookie', qrCodeToken, {
          httpOnly: true,
          secure: true, //! secure für safari test rausnehmen
          // sameSite: 'none',
        })
        .json({ success: true, message: 'pin correct', data: { user_id: qrcode.user, scannedBy: qrcode.scannedBy } });
    } else {
      res.status(404).json({ success: false, message: 'something went wrong' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}
