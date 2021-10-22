import { Schema } from 'mongoose';

export default function schemaWrapper<T>(fields: any): Schema<T> {
  return new Schema<T>({
    created: {
      default: () => Date.now(),
      required: true,
      type: Number,
    },
    updated: {
      default: () => Date.now(),
      required: true,
      type: Number,
    },
    ...fields,
  });
}
