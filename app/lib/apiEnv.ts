export const DEV_ENV_URL = 'http://localhost:3000';
export const PROD_ENV_URL = 'https://office-days.com';

export const ENV_URL = import.meta.env.DEV ? DEV_ENV_URL : PROD_ENV_URL;
