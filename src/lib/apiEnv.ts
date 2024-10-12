import { getRequestEvent, isServer } from 'solid-js/web';

export const DEV_ENV_URL = 'http://localhost:3000';
export const PROD_ENV_URL = 'https://office-days.com';

export const ENV_URL = import.meta.env.DEV ? DEV_ENV_URL : PROD_ENV_URL;

export const tryGetOrigin = () => {
  if (!isServer) {
    return window.location.origin;
  }
  const request = getRequestEvent();
  if (!request) {
    return undefined;
  }

  const url = request.request.url;
  if (!url) {
    return undefined;
  }

  return new URL(url).origin;
};

export const getOrigin = () => {
  const url = getUrl();

  return new URL(url).origin;
};

/**
 * Gets the URL of the request on the server, or the current URL on the client
 */
export const getUrl = () => {
  if (isServer) {
    const url = getRequestEvent()?.request.url;

    if (!url) {
      throw new Error(
        'Request URL was not found. Likely this function is not being called from a request context.'
      );
    }

    return url;
  }

  return window.location.href;
};
