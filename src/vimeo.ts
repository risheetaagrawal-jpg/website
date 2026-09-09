import { youtubeEmbedUrl } from './youtube';

/** Accept video URLs only, leaving profile and other external links alone. */
export function vimeoEmbedUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const match = url.hostname === 'player.vimeo.com'
      ? url.pathname.match(/^\/video\/(\d+)\/?$/)
      : ['vimeo.com', 'www.vimeo.com'].includes(url.hostname)
        ? url.pathname.match(/^\/(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/)
        : null;
    if (!match) return null;
    const embed = new URL(`https://player.vimeo.com/video/${match[1]}`);
    const hash = url.searchParams.get('h') ?? match[2];
    if (hash) embed.searchParams.set('h', hash);
    embed.searchParams.set('autoplay', '1');
    embed.searchParams.set('playsinline', '1');
    embed.searchParams.set('dnt', '1');
    return embed.href;
  } catch {
    return null;
  }
}

/** Delegation also covers cards inserted by snapshot hydration and navigation. */
export function installVideoPlayer(): () => void {
  let activeDialog: HTMLDialogElement | null = null;
  const close = () => activeDialog?.close();

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link || !link.closest('.recovered-page') || link.hasAttribute('download')) return;
    const youtubeSrc = youtubeEmbedUrl(link.href);
    const src = vimeoEmbedUrl(link.href) ?? youtubeSrc;
    if (!src) return;
    event.preventDefault();
    if (activeDialog) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'eo2-vimeo-player';
    dialog.setAttribute('aria-label', 'Video player');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'eo2-vimeo-close';
    button.textContent = 'Close video';
    button.autofocus = true;
    button.addEventListener('click', close);
    const frame = document.createElement('iframe');
    frame.title = link.querySelector('img')?.alt || link.getAttribute('aria-label') || 'EO2 EXP film';
    frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    frame.src = src;
    dialog.append(button, frame);
    if (youtubeSrc) {
      const fallback = document.createElement('a');
      fallback.className = 'eo2-video-fallback';
      fallback.href = link.href;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Watch on YouTube';
      dialog.append(fallback);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.addEventListener('close', () => {
      // Removing the iframe stops both playback and audio.
      dialog.remove();
      document.body.style.overflow = previousOverflow;
      activeDialog = null;
      if (link.isConnected) link.focus({ preventScroll: true });
    }, { once: true });
    dialog.addEventListener('click', (click) => {
      const bounds = dialog.getBoundingClientRect();
      if (click.target === dialog && (click.clientX < bounds.left || click.clientX > bounds.right
        || click.clientY < bounds.top || click.clientY > bounds.bottom)) close();
    });
    activeDialog = dialog;
    document.body.append(dialog);
    dialog.showModal();
  };

  document.addEventListener('click', onClick);
  window.addEventListener('popstate', close);
  return () => {
    close();
    document.removeEventListener('click', onClick);
    window.removeEventListener('popstate', close);
  };
}
