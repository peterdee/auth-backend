import { Generic } from './types';
import schemaWrapper from './schema-wrapper';

export interface Password extends Generic {
  hash: string;
  userId: string;
}

export default schemaWrapper<Password>({
  hash: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
    unique: true,
  },
});
