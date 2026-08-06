export const CODE_MIN_LENGTH = 4;
export const CODE_MAX_LENGTH = 64;

/** @param {string} value */
export function normalizeCode(value) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, '-');
}

/** @param {string} value */
export function isCodeFormatValid(value) {
  const code = normalizeCode(value);
  return (
    code.length >= CODE_MIN_LENGTH && code.length <= CODE_MAX_LENGTH && /^[A-Z0-9-]+$/.test(code)
  );
}
