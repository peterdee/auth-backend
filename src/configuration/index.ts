const { env: environment } = process;

export const ACCESS_TOKEN_EXPIRATION = (
  Number(environment.ACCESS_TOKEN_EXPIRATION) || 1
) * 24 * 60 * 60;

export const ENVS = {
  development: 'development',
  heroku: 'heroku',
  production: 'production',
} as const;

export const { ENV = ENVS.development } = environment;

export const REFRESH_TOKEN_EXPIRATION = (
  Number(environment.ACCESS_TOKEN_EXPIRATION) || 14
) * 24 * 60 * 60;


export const PORT = Number(environment.PORT) || 6500;
