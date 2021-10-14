import { Schema } from 'mongoose';

import { Generic } from './types';

export interface Password extends Generic {
  hash: string;
  userId: string;
}

export const PasswordSchema = new Schema<Password>({
  created: {
    required: true,
    type: Number,
  },
  hash: {
    required: true,
    type: String,
  },
  updated: {
    required: true,
    type: Number,
  },
  userId: {
    required: true,
    type: String,
    unique: true,
  },
});
