import path from "node:path"

/** Resolve `segments` under `root` and reject path traversal. */
export function resolveUnderRoot(
  root: string,
  segments: string | string[],
  label = "path",
): string {
  const parts = Array.isArray(segments) ? segments : [segments]
  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(resolvedRoot, ...parts)
  const rel = path.relative(resolvedRoot, resolved)
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Path traversal detected in ${label}`)
  }
  return resolved
}

/** Ensure `target` (already resolved or relative) stays inside `root`. */
export function assertWithinRoot(
  root: string,
  target: string,
  label = "path",
): string {
  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(target)
  const rel = path.relative(resolvedRoot, resolved)
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Path traversal detected in ${label}`)
  }
  return resolved
}
