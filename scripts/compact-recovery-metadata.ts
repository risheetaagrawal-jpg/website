/** Drop editor provenance, while keeping IDs used by recovered CSS and media. */
export function compactRecoveryMetadata(html: string): string {
  const embeddedCode = [...html.matchAll(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)\s*>/gi)]
    .map(([block]) => block.toLowerCase()).join("\n");
  // Some recovered page styles still select editor IDs. Keep the entire attribute
  // in those snapshots, including selectors using presence or substring matching.
  const removable = new Set(["data-wf-id", "data-w-item-id"]
    .filter((name) => !embeddedCode.includes(name)));
  // Match complete tags, including quoted values, so text and embedded CSS stay intact.
  return html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<[a-z][^<>"']*(?:(?:"[^"]*"|'[^']*')[^<>"']*)*>/gi, (tag) => {
    if (/^<!--|^<(?:script|style)\b/i.test(tag)) return tag;
    return tag.replace(/(\s+)([^\s=<>]+)(\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g, (attribute, _space, name: string) => (
      removable.has(name.toLowerCase()) ? "" : attribute
    ));
  });
}
