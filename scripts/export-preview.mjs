import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// A portable, single-HTML website preview. The MP4 stays alongside it in public/.
let html = readFileSync('dist/index.html', 'utf8');
const cssPath = html.match(/href="(\/assets\/[^\"]+\.css)"/)[1];
const jsPath = html.match(/src="(\/assets\/[^\"]+\.js)"/)[1];
const mime = path => path.endsWith('.png') ? 'image/png' : path.endsWith('.jpg') ? 'image/jpeg' : path.endsWith('.svg') ? 'image/svg+xml' : path.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
const dataUrl = path => `data:${mime(path)};base64,${readFileSync(path).toString('base64')}`;
let css = readFileSync(`dist${cssPath}`, 'utf8');
css = css.replace(/url\(([^)]+)\)/g, (whole, url) => {
  const path = url.replace(/["']/g, '');
  return path.startsWith('/assets/') ? `url("${dataUrl(`dist${path}`)}")` : whole;
});
let js = readFileSync(`dist${jsPath}`, 'utf8');
for (const asset of ['/icon.png', '/assets/video-poster.jpg']) js = js.replaceAll(asset, dataUrl(`public${asset}`));
js = js.replaceAll('/browser-control-demo.mp4', './public/browser-control-demo.mp4').replaceAll('/demo-captions.vtt', './public/demo-captions.vtt');
html = html.replace(/<script type="module"[^>]+><\/script>/, '')
  .replace(/<link rel="stylesheet"[^>]+>/, `<style>${css}</style>`)
  .replace('href="/favicon.svg"', `href="${dataUrl('public/favicon.svg')}"`)
  .replace('</body>', () => `<script type="module">${js.replaceAll('</script', '<\\/script')}</script></body>`);
writeFileSync('website-preview.html', html);
console.log(`Portable website preview: ${resolve('website-preview.html')} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB)`);
