import { Dispatch, SetStateAction } from 'react';

export interface LoginProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}
export interface LogoutProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}

export interface DashboardProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}

export interface VerifyCodeProps {
  verified: boolean;
  setVerified: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  response: ResponseType;
  setResponse: Dispatch<SetStateAction<ResponseType>>;
  slug: string | undefined;
}

export interface VerifyEmailProps {
  setEmailSent: Dispatch<SetStateAction<boolean>>;
  response: ResponseType;
  setResponse: Dispatch<SetStateAction<ResponseType>>;
  slug: string | undefined;
}

export interface VerifyPinProps {
  slug: string | undefined;
}

export type QrCodeData = { dataURL: string; expiresAt: number; slug: string } | null;

export type ResponseType = { success: boolean; message: string; data?: any } | null;

export type File = {
  fileURL: string;
  fileID: string;
};
