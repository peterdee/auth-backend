import schemaWrapper from './schema-wrapper';
import { Generic } from './types';

export interface UserSecret extends Generic {
  secret: string;
  userId: string;
}

export default schemaWrapper<UserSecret>({
  secret: {
    required: true,
    type: String,
    unique: true,
  },
  userId: {
    required: true,
    type: String,
    unique: true,
  },
});
