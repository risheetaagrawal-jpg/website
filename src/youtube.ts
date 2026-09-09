function startSeconds(value: string | null): number | null {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  const parts = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  return parts ? Number(parts[1] ?? 0) * 3600 + Number(parts[2] ?? 0) * 60 + Number(parts[3] ?? 0) : null;
}

/** Convert video links, not channels or playlists, to privacy-enhanced embeds. */
export function youtubeEmbedUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') {
      id = url.pathname.match(/^\/([\w-]{11})\/?$/)?.[1] ?? null;
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      id = url.pathname === '/watch'
        ? url.searchParams.get('v')
        : url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/)?.[1] ?? null;
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
    const start = startSeconds(url.searchParams.get('start') ?? url.searchParams.get('t')
      ?? new URLSearchParams(url.hash.slice(1)).get('t'));
    if (start !== null && Number.isSafeInteger(start) && start > 0) embed.searchParams.set('start', String(start));
    embed.searchParams.set('autoplay', '1');
    embed.searchParams.set('playsinline', '1');
    return embed.href;
  } catch {
    return null;
  }
}
