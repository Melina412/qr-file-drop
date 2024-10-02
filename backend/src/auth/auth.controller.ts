import { User } from '../users/user.model';
import { createSalt, createHash, createToken } from './auth.service';
import { Request, Response } from 'express';

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
      res.status(401).json({ success: false, message: 'login failed' });
      return;
    }

    if (user.password !== createHash(password, user.salt)) {
      res.status(401).json({ success: false, message: 'login failed' });
      return;
    }

    const payload = { user: user._id, email: user.email };
    const accessToken = createToken(payload, '1h');
    const refreshToken = createToken(payload, '24h');

    //# cookie -----------------------------------------------------------
    res.cookie('accessCookie', accessToken, {
      httpOnly: true,
      secure: true, //! secure für safari test rausnehmen
      //   sameSite: 'None',
    });

    //# cookie -----------------------------------------------------------
    res.cookie('refreshCookie', refreshToken, {
      httpOnly: true,
      secure: true,
      //   sameSite: 'None',
    });

    res.json({
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
  res.clearCookie('accessCookie');
  res.clearCookie('refreshCookie');
  res.json({ success: true, message: 'logout successful' });
}

export function protector(req: Request, res: Response): void {
  const payload = req.payload;
  res.json(payload.exp);
}
