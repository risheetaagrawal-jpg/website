import { expect, test } from 'bun:test';
import { vimeoEmbedUrl } from '../src/vimeo';

test('converts Vimeo video links while preserving unlisted access hashes', () => {
  for (const href of ['https://vimeo.com/123/abc123', 'https://player.vimeo.com/video/123?h=abc123']) {
    const url = new URL(vimeoEmbedUrl(href)!);
    expect(url.origin + url.pathname).toBe('https://player.vimeo.com/video/123');
    expect(url.searchParams.get('h')).toBe('abc123');
    expect(url.searchParams.get('autoplay')).toBe('1');
  }
  expect(vimeoEmbedUrl('https://vimeo.com/1087645530?share=copy')).toContain('/video/1087645530?');
});

test('leaves profiles, other providers, malformed URLs and lookalike hosts alone', () => {
  for (const href of ['https://vimeo.com/eo2exp', 'https://youtube.com/123', 'https://vimeo.com.evil.test/123', 'javascript:alert(1)', 'not a URL']) {
    expect(vimeoEmbedUrl(href)).toBeNull();
  }
});
