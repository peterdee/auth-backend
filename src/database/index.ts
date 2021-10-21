import mongoose, { Connection, Model } from 'mongoose';

import { DATABASE_CONNECTION_STRING } from '../configuration';
import log from '../utilities/log';

import PasswordSchema, { Password } from './schemas/Password.schema';
import UserSchema, { User } from './schemas/User.schema';
import UserSecretSchema, { UserSecret } from './schemas/UserSecret.schema';

interface ConnectionOptions {
  [key: string]: boolean | number | string;
}

interface ConnectResult {
  connection: Connection;
  PasswordModel: Model<Password>;
  UserModel: Model<User>;
  UserSecretModel: Model<UserSecret>;
}

async function connect(
  connectionString: string,
  options: ConnectionOptions,
): Promise<ConnectResult> {
  const connection = await new Promise<Connection>(
    (resolve, reject) => mongoose.connect(
      connectionString,
      options,
      (error) => {
        if (error) {
          return reject(error);
        }

        return resolve(mongoose.connection);
      },
    ),
  );

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
  private connectionString: string;

  private connectionOptions: ConnectionOptions;

  public connection: Connection;

  public PasswordModel: Model<Password>;

  public UserModel: Model<User>;

  public UserSecretModel: Model<UserSecret>;

  private async createConnection(): Promise<void | Error> {
    try {
      const result = await connect(this.connectionString, this.connectionOptions);
      this.connection = result.connection;
      this.PasswordModel = result.PasswordModel;
      this.UserModel = result.UserModel;
      this.UserSecretModel = result.UserSecretModel;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async connect(
    connectionString = DATABASE_CONNECTION_STRING,
    options?: ConnectionOptions,
  ): Promise<Connection> {
    this.connectionOptions = options || {};
    this.connectionString = connectionString;
    if (!this.connection) {
      await this.createConnection();
      return this.connection;
    }
    return this.connection;
  }

  async disconnect(forced = false): Promise<void> {
    if (this.connection) {
      await this.connection.close(forced);
    }
  }

  async getInstance(): Promise<Connection | null> {
    if (!this.connection) {
      return null;
    }
    return this.connection;
  }
}

const Instance = new Database();

export {
  Password,
  User,
  UserSecret,
};

export default Instance;
