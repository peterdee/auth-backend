import { Schema } from 'mongoose';

export default function schemaWrapper<T>(fields: any): Schema<T> {
  return new Schema<T>({
    created: {
      required: true,
      type: Number,
    },
    updated: {
      required: true,
      type: Number,
    },
    ...fields,
  });
}
