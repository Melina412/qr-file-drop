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

export type FileType = {
  fileURL: string;
  fileID: string;
  fileName: string;
  resourceType: 'raw' | 'auto' | 'image' | 'video';
  format: string;
  _id: string;
};

export interface FileUploadProps {
  setUploadFileResponse: Dispatch<SetStateAction<ResponseType>>;
  setDeleteFileResponse: Dispatch<SetStateAction<ResponseType>>;
  setDeleteFolderResponse: Dispatch<SetStateAction<ResponseType>>;
  getFilesResponse: ResponseType;
  uploadFileResponse: ResponseType;
}

export interface GenerateCodeProps {
  getFilesResponse: ResponseType;
}
