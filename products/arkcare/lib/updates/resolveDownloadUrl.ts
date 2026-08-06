export function resolveDownloadUrl(apkUrl: string, manifestUrl: string) {
  if (apkUrl.startsWith("http")) return apkUrl;
  return new URL(apkUrl, new URL(manifestUrl, window.location.href)).toString();
}
