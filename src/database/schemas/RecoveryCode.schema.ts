import { Generic } from './types';
import schemaWrapper from './schema-wrapper';

export interface RecoveryCode extends Generic {
  code: string;
  expiresAt: number;
  recoveryType: string;
  userId: string;
}

export default schemaWrapper<RecoveryCode>({
  code: {
    required: true,
    type: String,
  },
  expiresAt: {
    required: true,
    type: Number,
  },
  recoveryType: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
});
