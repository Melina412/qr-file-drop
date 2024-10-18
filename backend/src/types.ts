export type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN' | 'QRCODE_TOKEN';
export type CookieType = 'accessCookie' | 'refreshCookie' | 'qrCodeCookie';

declare global {
  namespace Express {
    interface Request {
      payload?: any;
    }
  }
}

export interface DestroyFileResponse {
  result: string;
}
