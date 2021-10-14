import { Schema } from 'mongoose';

import { Generic } from './types';

export interface UserSecret extends Generic {
  secret: string;
  userId: string;
}

export const UserSecretSchema = new Schema<UserSecret>({
  created: {
    required: true,
    type: Number,
  },
  secret: {
    required: true,
    type: String,
    unique: true,
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
