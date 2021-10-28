const { env: environment } = process;

export const ACCESS_TOKEN_EXPIRATION = (
  Number(environment.ACCESS_TOKEN_EXPIRATION) || 1
) * 24 * 60 * 60;

export const ENVS = {
  development: 'development',
  heroku: 'heroku',
  production: 'production',
} as const;

export const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DATABASE_CONNECTION_STRING,
  ENV = ENVS.development,
  MAILER_SERVICE_EMAIL,
  MAILER_SERVICE_PASSWORD,
  TESTING = 'false',
} = environment;

export const REFRESH_TOKEN_EXPIRATION = (
  Number(environment.ACCESS_TOKEN_EXPIRATION) || 14
) * 24 * 60 * 60;

export const PORT = Number(environment.PORT) || 6500;

export const RECOVERY_CODE_TYPES = {
  account: 'account',
  email: 'email',
} as const;

export const RESPONSE_MESSAGES = {
  accessDenied: 'ACCESS_DENIED',
  emailAlreadyInUse: 'EMAIL_ALREADY_IN_USE',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  invalidData: 'INVALID_DATA',
  missingData: 'MISSING_DATA',
  ok: 'OK',
} as const;

export const RESPONSE_STATUSES = {
  badRequest: 400,
  conflict: 409,
  internalServerError: 500,
  ok: 200,
  unauthorized: 401,
} as const;

export const ROLES = {
  admin: 'admin',
  user: 'user',
} as const;
