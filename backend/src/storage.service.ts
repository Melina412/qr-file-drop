import cloudinary from 'cloudinary';
import type { UploadApiResponse, DeleteApiResponse } from 'cloudinary';

export async function uploadCloudinaryFile(buffer: Buffer) {
  const uploadResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          folder: 'qr-codes',
          resource_type: 'raw', // für pdf wichtig
          type: 'upload',
        },
        (error, result) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(result as UploadApiResponse);
        }
      )
      .end(buffer);
  });
  console.log('uploadFile uploadResult:', uploadResult);
  return uploadResult;
}

export async function deleteCloudinaryFile(public_id: string) {
  console.log('deleteFile id:', public_id);
  const deleteResult = await new Promise<DeleteApiResponse | undefined>((resolve, reject) => {
    cloudinary.v2.uploader.destroy(public_id, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result as DeleteApiResponse);
    });
    return deleteResult;
  });
}
