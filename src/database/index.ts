import {
  Connection,
  ConnectOptions,
  createConnection,
  Model,
} from 'mongoose';

import log from '../utilities/log';
import PasswordSchema, { Password } from './schemas/Password.schema';
import RecoveryCodeSchema, { RecoveryCode } from './schemas/RecoveryCode.schema';
import UserSchema, { User } from './schemas/User.schema';
import UserSecretSchema, { UserSecret } from './schemas/UserSecret.schema';

export {
  Password,
  RecoveryCode,
  User,
  UserSecret,
};

class Database {
  private Connection: Connection | null = null;

  public PasswordCollection: Model<Password>;

  public RecoveryCodeCollection: Model<RecoveryCode>;

  public UserCollection: Model<User>;

  public UserSecretCollection: Model<UserSecret>;

  async connect(
    connectionString: string,
    options: ConnectOptions = {},
  ): Promise<Connection | Error> {
    if (this.Connection && this.Connection.readyState === 1) {
      return this.Connection;
    }

    try {
      if (!connectionString) {
        throw new Error('MongoDB connection string was not provided!');
      }

      const connection = await createConnection(connectionString, options).asPromise();
      this.Connection = connection;

      if (this.Connection.readyState === 1) {
        log('-- database connected');
      }

      this.Connection.on(
        'close',
        (forced: boolean): void => log(
          `-- database connection closed ${forced ? '(forced)' : ''}`,
        ),
      );
      this.Connection.on(
        'error',
        (error: Error): void => log(
          `-- database connection got an error\n${error.message}`,
        ),
      );

      this.PasswordCollection = this.Connection.model<Password>('Password', PasswordSchema);
      this.RecoveryCodeCollection = this.Connection.model<RecoveryCode>(
        'RecoveryCode',
        RecoveryCodeSchema,
      );
      this.UserCollection = this.Connection.model<User>('User', UserSchema);
      this.UserSecretCollection = this.Connection.model<UserSecret>('UserSectet', UserSecretSchema);

      return this.Connection;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async disconnect(forced = false) {
    if (!this.Connection) {
      return null;
    }

    return this.Connection.close(forced);
  }

  async getConnection(): Promise<null | Connection> {
    if (!this.Connection) {
      return null;
    }

    return this.Connection;
  }
}

export default new Database();
