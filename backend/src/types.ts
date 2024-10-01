export type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN' | 'QRCODE_TOKEN';

declare global {
  namespace Express {
    interface Request {
      payload?: any;
    }
  }
}
