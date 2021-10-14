import { Schema } from 'mongoose';

import { Generic } from './types';

export interface User extends Generic {
  email: string;
  firstName: string;
  lastName: string;
}

export const UserSchema = new Schema<User>({
  created: {
    required: true,
    type: Number,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  updated: {
    required: true,
    type: Number,
  },
});
