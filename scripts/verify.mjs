import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

// Exercise observable behavior against a running development or production server.
const origin = process.env.SITE_URL || 'http://localhost:5173';
const remotionChrome = 'node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({
  ...(existsSync(remotionChrome) ? { executablePath: remotionChrome } : {}),
  args: ['--no-sandbox'],
});
mkdirSync('out/verification', { recursive: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.match(await page.title(), /Browser Control/);
  for (const [label, content] of [
    ['Memory', 'prefers quiet places'],
    ['Reusable skills', 'Weekly research'],
    ['You’re in control', 'Auto review'],
    ['Browser actions', 'Slow mornings'],
  ]) {
    const tab = page.getByRole('tab', { name: label, exact: true });
    await tab.click();
    assert.equal(await tab.getAttribute('aria-selected'), 'true');
    assert.match((await page.getByRole('tabpanel').textContent()).toLowerCase(), new RegExp(content.toLowerCase()));
  }
  await page.getByRole('tab', { name: 'Browser actions', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'Memory', exact: true }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home');
  const question = page.getByText('What do I need to get started?', { exact: true });
  await question.click();
  assert.equal(await question.locator('..').getAttribute('open'), '');
  await question.click();
  for (const link of await page.getByRole('link', { name: /Add to Chrome|Give your browser a superpower/ }).all()) {
    assert.match(await link.getAttribute('href'), /mpdfhhhjgbpdpfnkjbnboebdjokfjglf/);
  }
  await page.getByRole('button', { name: /Watch the demo/ }).click();
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 1);
  assert.equal(await page.getByRole('dialog').isVisible(), true);
  const media = await page.locator('video').evaluate(video => ({ duration: video.duration, width: video.videoWidth, height: video.videoHeight }));
  assert.ok(Math.abs(media.duration - 45) < .1);
  assert.equal(media.width, 1920);
  assert.equal(media.height, 1080);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'out/verification/desktop.png', fullPage: true });
  for (const width of [320, 360, 390, 540, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(dimensions.actual <= width, `Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.getByRole('navigation').isVisible(), true);
  await page.getByRole('navigation').getByRole('link', { name: 'Features', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'out/verification/mobile.png', fullPage: true });
  const brokenImages = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
  assert.deepEqual(brokenImages, []);
  assert.deepEqual(errors, []);
  console.log('PASS: feature tabs, keyboard navigation, FAQ, store links, video metadata, Escape dismissal, mobile menu, 7 viewport widths, images, and runtime errors.');
  console.log(`Video: ${media.width}×${media.height}, ${media.duration.toFixed(2)} seconds. Screenshots: out/verification/`);
} finally {
  await browser.close();
}
