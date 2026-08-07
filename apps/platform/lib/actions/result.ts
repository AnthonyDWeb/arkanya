export type ActionOk<T> = { ok: true; data: T }
export type ActionErr = { ok: false; error: string; status?: number }
export type ActionResult<T> = ActionOk<T> | ActionErr

export function ok<T>(data: T): ActionOk<T> {
  return { ok: true, data }
}

export function fail(error: string, status = 400): ActionErr {
  return { ok: false, error, status }
}
