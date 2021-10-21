import { Generic } from './types';
import { ROLES } from '../../configuration';
import schemaWrapper from './schema-wrapper';

export interface User extends Generic {
  email: string;
  firstName: string;
  lastName: string;
  role: keyof typeof ROLES;
}

export default schemaWrapper<User>({
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
  role: {
    required: true,
    type: String,
  },
});
