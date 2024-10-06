import { Dispatch, SetStateAction } from 'react';

export interface LoginProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}
export interface LogoutProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}

export type QrCodeData = { dataURL: string; expiresAt: number } | null;
