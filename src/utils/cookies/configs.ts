export const accessTokenConfigs = {
  maxAge: 20 * 60 *  1000,
  path: "/",
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.PROD_DOMAIN
      : process.env.DEV_DOMAIN,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  overwrite: true
} as const;

export const refreshTokenConfigs = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/account",
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.PROD_DOMAIN
      : process.env.DEV_DOMAIN,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  overwrite: true
} as const;
