import { Buffer } from 'node:buffer';

/**
 * Gets a random non-guessable ID that's short, so that it's easier to type into a URL
 */
export const getShortId = () => {
  const uuid = crypto.randomUUID();

  const buffer = Buffer.from(uuid.replaceAll('-', ''), 'hex');
  return buffer.toString('base64url');
};
