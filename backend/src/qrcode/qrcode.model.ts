import mongoose from 'mongoose';

const qrcodeSchema = new mongoose.Schema({
  dataURL: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
});

export const Qrcode = mongoose.model('qrcode', qrcodeSchema);
