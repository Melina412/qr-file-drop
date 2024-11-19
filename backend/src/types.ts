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

export interface DeleteResourcesByPrefixResponse {
  deleted: Object;
  deleted_counts: Object;
  partial: Boolean;
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
}
