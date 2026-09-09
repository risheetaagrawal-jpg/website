import { expect, test } from 'bun:test';
import { youtubeEmbedUrl } from '../src/youtube';
import { selectedWorkStudios } from '../src/selectedWorkData';

test('supports every current YouTube project and retains video timestamps', () => {
  const projects = selectedWorkStudios.flatMap(s => s.projects).filter(p => p.platform === 'YouTube');
  expect(projects.length).toBe(11);
  for (const project of projects) expect(youtubeEmbedUrl(project.href)).toStartWith('https://www.youtube-nocookie.com/embed/');
  expect(new URL(youtubeEmbedUrl('https://www.youtube.com/watch?v=RxmaWPGGJH4&t=521s')!).searchParams.get('start')).toBe('521');
});

test('supports short, Shorts, live and embed URLs and time formats', () => {
  for (const path of ['https://youtu.be/ROj-sKxl_TI', 'https://m.youtube.com/shorts/ROj-sKxl_TI', 'https://youtube.com/live/ROj-sKxl_TI', 'https://www.youtube-nocookie.com/embed/ROj-sKxl_TI']) {
    expect(new URL(youtubeEmbedUrl(path + '?t=1h2m3s')!).searchParams.get('start')).toBe('3723');
  }
  expect(youtubeEmbedUrl('https://youtu.be/ROj-sKxl_TI#t=95')).toContain('start=95');
  expect(youtubeEmbedUrl('https://youtu.be/ROj-sKxl_TI?start=12&t=30')).toContain('start=12');
});

test('does not intercept profiles, playlists, other providers or malformed IDs', () => {
  for (const href of ['https://youtube.com/@eo2exp', 'https://youtube.com/playlist?list=123', 'https://youtube.com.evil.test/watch?v=ROj-sKxl_TI', 'https://vimeo.com/123', 'https://youtube.com/watch?v=bad', 'javascript:alert(1)']) {
    expect(youtubeEmbedUrl(href)).toBeNull();
  }
});
