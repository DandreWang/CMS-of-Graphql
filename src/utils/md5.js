import { createHash } from 'crypto-browserify';

export default function md5(str) {
  return createHash('md5')
    .update(str)
    .digest('base64');
}
