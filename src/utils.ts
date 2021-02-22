import zlib from 'zlib';

export const decodeFromBase64 = (base64: string): Uint8Array => {
  return new Uint8Array(Buffer.from(base64, 'base64'));
};

const arrayToString = (array: Uint8Array) => {
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += String.fromCharCode(array[i]);
  }
  return str;
};

export const decompressJson = (compressedJson: string): string =>
  arrayToString(
    new Uint8Array(zlib.inflateSync(decodeFromBase64(compressedJson))),
  );

export const padStart = (value: string, length: number, padChar: string) => {
  let padding = '';
  for (let idx = 0, len = length - value.length; idx < len; idx++) {
    padding += padChar;
  }
  return padding + value;
};
