import cloudinary from 'cloudinary';
import type { UploadApiResponse, UploadApiOptions, ResourceType } from 'cloudinary';
import type { DestroyFileResponse } from 'types';

export async function uploadFile(buffer: Buffer, resourceType: UploadApiOptions['resource_type'], user: string) {
  const uploadResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          folder: `qr-codes/${user}`,
          resource_type: resourceType, // raw für pdf wichtig
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

export async function destroyFile(public_id: string, resource_type?: ResourceType) {
  console.log('File for deletion:', public_id);
  const destroyResult = await new Promise<DestroyFileResponse | undefined>((resolve, reject) => {
    cloudinary.v2.uploader.destroy(public_id, { resource_type }, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
  console.log({ destroyResult });
  return destroyResult;
}
