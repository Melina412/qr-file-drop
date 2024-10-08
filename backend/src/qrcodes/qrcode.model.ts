import mongoose from 'mongoose';

const qrcodeSchema = new mongoose.Schema({
  dataURL: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
  },
  salt: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
  scanned: {
    type: Boolean,
    default: false,
  },
  scannedBy: {
    type: String,
  },
  scannedAt: {
    type: Date,
  },
});

export const Qrcode = mongoose.model('qrcode', qrcodeSchema);
