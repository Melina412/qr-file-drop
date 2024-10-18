import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  displayName: {
    type: String,
  },
  files: [
    {
      fileURL: String,
      fileID: String,
      fileName: String,
      resourceType: String,
      format: String,
    },
  ],
});

export const User = mongoose.model('user', userSchema);
