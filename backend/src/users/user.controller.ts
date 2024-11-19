import { Request, Response } from 'express';
import { Qrcode } from '../qrcodes/qrcode.model';
import { User } from './user.model';
import { destroyFile, uploadFile, deleteFolder } from '../storage/storage.service';
import type { UploadApiOptions } from 'cloudinary';

export async function getUserQrcodes(req: Request, res: Response): Promise<void> {
  try {
    const qrcodes = await Qrcode.find({ user: req.payload.user });
    res.status(200).json({ success: true, message: 'qrcodes found', data: [qrcodes] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function getUserFiles(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.payload.user);
    // console.log({ user });

    if (!user) {
      res.status(404).json({ success: false, message: 'user not found' });
      return;
    }

    const files = user.files;
    console.log({ files });

    files.length === 0
      ? res.status(200).json({ success: true, message: 'user has no files', data: files })
      : res.status(200).json({ success: true, message: 'files found', data: files });
    // bei status 204 kann man keinen json res mitschicken
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'something went wrong' });
  }
}

export async function addFile(req: Request, res: Response): Promise<void> {
  const userID = req.payload.user;

  console.log({ userID });

  console.log('req.file', req.file);

  const { buffer, mimetype } = req.file;
  const { fileName } = req.body;

  let resourceType: UploadApiOptions['resource_type'] = 'raw';
  if (mimetype.startsWith('image/')) {
    resourceType = 'image';
  } else if (mimetype.startsWith('video/')) {
    resourceType = 'video';
  }

  try {
    const user = await User.findById(userID);
    // console.log({ user });

    if (user) {
      //! hier muss ich nach den fileID suchen und die matchen

      try {
        const cloudinaryResult = await uploadFile(buffer, resourceType, user.email);
        const { secure_url, public_id, resource_type, format } = cloudinaryResult;
        const file = {
          fileID: public_id,
          fileURL: secure_url,
          fileName,
          resourceType: resource_type,
          format: format ? format : mimetype.split('/')[1],
        };

        const updateResult = await User.updateOne(
          { _id: userID },
          {
            $push: {
              files: file,
            },
          }
        );

        if (updateResult.modifiedCount === 0) {
          res.status(404).json({ success: false, message: 'file not added' });
          return;
        }
        res.status(200).json({ success: true, message: 'file added', data: file });
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
  const { _id, fileID, resourceType } = req.body;
  const userID = req.payload.user;
  console.log('req.body', req.body);

  try {
    const cloudinaryResult = await destroyFile(fileID, resourceType);
    const cloudinaryResponse =
      cloudinaryResult.result === 'ok' ? '❎ cloudinary file deleted' : '⚠️ cloudinary file not deleted';
    console.log({ cloudinaryResponse });

    const dbResult = await User.updateOne(
      { _id: userID },
      {
        $pull: {
          files: { _id: _id },
        },
      }
    );
    console.log({ dbResult });

    if (dbResult.modifiedCount === 0) {
      res.status(404).json({ success: false, message: 'db delete error' });
      return;
    }

    console.log('❎ file deleted from db');
    res.status(200).json({ success: true, message: 'file deleted from db', details: cloudinaryResponse });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

export async function deleteAllFiles(req: Request, res: Response): Promise<void> {
  const { user, email } = req.payload;

  const prefix = `qr-codes/${email}/`;
  console.log({ prefix });

  try {
    const cloudinaryResult = await deleteFolder(prefix);
    console.log({
      'deleted files': {
        img: cloudinaryResult.imgResult.deleted,
        raw: cloudinaryResult.rawResult.deleted,
      },
    });

    const cloudinaryResponse =
      Object.keys(cloudinaryResult.imgResult.deleted).length === 0 &&
      Object.keys(cloudinaryResult.rawResult.deleted).length === 0
        ? '⚠️ cloudinary folder not deleted'
        : '❎ cloudinary folder deleted';
    console.log({ cloudinaryResponse });

    const dbResult = await User.updateOne(
      { _id: user },
      {
        $pull: {
          files: {},
        },
      }
    );
    console.log({ dbResult });

    if (dbResult.modifiedCount === 0) {
      res.status(404).json({ success: false, message: 'db delete error' });
      return;
    }

    console.log('❎ folder deleted from db');
    res.status(200).json({
      success: true,
      message: 'folder deleted from db',
      details: {
        cloudinaryResponse,
        deletedCount: {
          img: Object.keys(cloudinaryResult.imgResult.deleted).length,
          raw: Object.keys(cloudinaryResult.rawResult.deleted).length,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
