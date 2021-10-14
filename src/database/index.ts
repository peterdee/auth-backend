import { Connection, createConnection, Model } from 'mongoose';

import { DATABASE_CONNECTION_STRING } from '../configuration';
import log from '../utilities/log';

import { Password, PasswordSchema } from './schemas/Password.schema';
import { User, UserSchema } from './schemas/User.schema';
import { UserSecret, UserSecretSchema } from './schemas/UserSecret.schema';

async function connect(connectionString: string) {
  const connection = await createConnection(connectionString).asPromise();
  if (connection.readyState === 1) {
    log('-- database connected');
  }

  connection.on('close', (isForced: boolean): void => log(
    `-- database connection closed ${isForced ? '(forced)' : ''}`,
  ));
  connection.on('error', (error: Error): void => log(
    `-- database connection got an error\n${error.message}`,
  ));

  const PasswordModel = connection.model<Password>('Password', PasswordSchema);
  const UserModel = connection.model<User>('User', UserSchema);
  const UserSecretModel = connection.model<UserSecret>('UserSecret', UserSecretSchema);

  return {
    connection,
    PasswordModel,
    UserModel,
    UserSecretModel,
  };
}

class Database {
  private static connection: Connection;

  private connectionString: string;

  public PasswordModel: Model<Password>;

  public UserModel: Model<User>;

  public UserSecretModel: Model<UserSecret>;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  private async createConnection() {
    try {
      const result = await connect(this.connectionString);
      Database.connection = result.connection;
      this.PasswordModel = result.PasswordModel;
      this.UserModel = result.UserModel;
      this.UserSecretModel = result.UserSecretModel;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async connect() {
    if (!Database.connection) {
      await this.createConnection();
      return Database.connection;
    }
    return Database.connection;
  }
}

export { Password, User, UserSecret };

export default new Database(DATABASE_CONNECTION_STRING);
