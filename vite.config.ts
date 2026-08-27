import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const snapshotManifestId = 'virtual:eo2-snapshot-manifest'
const resolvedSnapshotManifestId = `\0${snapshotManifestId}`
const snapshotManifestPath = resolve(import.meta.dirname, 'public/snapshots/manifest.json')

function readSnapshotManifest() {
  return JSON.parse(readFileSync(snapshotManifestPath, 'utf8')) as Record<
    string,
    { bodyClass: string; file: string; title: string }
  >
}

function snapshotBootstrap() {
  const manifest = readSnapshotManifest()
  const routeFiles = Object.fromEntries(
    Object.entries(manifest).map(([route, snapshot]) => [route, snapshot.file]),
  )
  const serializedFiles = JSON.stringify(routeFiles).replaceAll('<', '\\u003c')
  return `(() => {
    const files = ${serializedFiles};
    const path = location.pathname.length > 1 && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const resolvedPath = path === '/events/featured' ? '/events' : path;
    const priorityImages = {
      '/events': '/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/650825fb408d9fa03715beb1_883A2278%20(4)-eo2-1600.webp',
      '/about-us': '/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/647486a3107043aab0fdda18_About%20Us-eo2-animated.webp',
      '/films/all': '/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/64f5e697e7f43df1873db6e8_Ali%203-p-800.jpeg',
    };
    const priorityImage = priorityImages[resolvedPath];
    if (priorityImage) {
      const image = document.createElement('link');
      image.rel = 'preload';
      image.as = 'image';
      image.href = priorityImage;
      image.fetchPriority = 'high';
      document.head.append(image);
    }
    if (resolvedPath === '/' && matchMedia('(max-width: 767px)').matches) {
      const video = document.createElement('link');
      video.rel = 'preload';
      video.as = 'video';
      video.type = 'video/mp4';
      video.href = '/recovered-assets/files/uploads-ssl.webflow.com/63dd2131ded6c2a2640cd5bd/647a21bd2a517cc70c96b23e_ShowreelEo2Trimmed-mobile.mp4';
      video.fetchPriority = 'high';
      document.head.append(video);
    }
    const file = files[resolvedPath + location.search] || files[resolvedPath] || files['/404'];
    if (!file) return;
    window.__eo2InitialSnapshot = {
      file,
      promise: fetch(file).then((response) => {
        if (!response.ok) throw new Error('Page request failed (' + response.status + ')');
        return response.text();
      }),
    };
  })();`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'eo2-snapshot-bootstrap',
      resolveId(id) {
        return id === snapshotManifestId ? resolvedSnapshotManifestId : undefined
      },
      load(id) {
        return id === resolvedSnapshotManifestId
          ? `export default ${JSON.stringify(readSnapshotManifest())}`
          : undefined
      },
      transformIndexHtml() {
        return [{
          tag: 'script',
          children: snapshotBootstrap(),
          injectTo: 'head-prepend',
        }]
      },
    },
    react(),
  ],
})
