/** Replace recovered remote dependencies while preserving unknown URLs. */
export function mapRecoveredAssets(
  html: string,
  assetMap: Readonly<Record<string, string>>,
): string {
  let mappedHtml = html;
  const entries = Object.entries(assetMap).sort(([left], [right]) => right.length - left.length);
  for (const [remoteUrl, localUrl] of entries) {
    mappedHtml = mappedHtml
      .replaceAll(remoteUrl, localUrl)
      .replaceAll(remoteUrl.replaceAll("&", "&amp;"), localUrl);
  }
  return mappedHtml
    .replace(/<iframe\b[^>]*(?:stripe|paypal)[\s\S]*?<\/iframe>/gi, "")
    .replace(/<div\b[^>]*id=["']lightbox-mountpoint["'][^>]*><\/div>/gi, "");
}
