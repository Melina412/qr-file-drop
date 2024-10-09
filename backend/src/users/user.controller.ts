import { Request, Response } from 'express';
import { Qrcode } from '../qrcodes/qrcode.model';
import { User } from './user.model';
import { deleteCloudinaryFile, uploadCloudinaryFile } from '../storage.service';

export async function getMyQrcodes(req: Request, res: Response): Promise<void> {
  try {
    const qrcodes = await Qrcode.find({ user: req.payload.user });
    res.status(200).json({ success: true, message: 'qrcodes found', data: [qrcodes] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function addFile(req: Request, res: Response): Promise<void> {
  const userID = req.payload.user;

  console.log({ userID });

  const file = req.file.buffer;
  const { fileName } = req.body;

  // console.log({ file });

  try {
    const user = await User.findById(userID);
    // console.log({ user });

    if (user) {
      //! hier muss ich nach den fileID suchen und die matchen

      try {
        const cloudinaryResult = await uploadCloudinaryFile(file);
        const fileURL = cloudinaryResult.secure_url;
        const fileID = cloudinaryResult.public_id;

        const updateResult = await User.updateOne(
          { _id: userID },
          {
            $set: {
              files: {
                fileID,
                fileURL,
                fileName,
              },
            },
          }
        );
        res.status(200).json({ success: true, message: 'file added', data: { fileID, fileURL, fileName } });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'cloudinary error' });
      }
      //
    } else {
      res.status(404).json({ success: false, message: 'user not found' });
    }
    //
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'server error' });
  }
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
  const { fileID } = req.body;
  try {
    const result = await deleteCloudinaryFile(fileID);
    res.status(200).json({ success: true, message: 'file deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
