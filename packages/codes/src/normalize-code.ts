export const CODE_MIN_LENGTH = 4
export const CODE_MAX_LENGTH = 64

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase().replace(/[\s_]+/g, "-")
}

export function isCodeFormatValid(value: string): boolean {
  const code = normalizeCode(value)
  return (
    code.length >= CODE_MIN_LENGTH &&
    code.length <= CODE_MAX_LENGTH &&
    /^[A-Z0-9-]+$/.test(code)
  )
}
