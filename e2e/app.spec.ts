import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const nav = (page: import('@playwright/test').Page) => page.getByRole('navigation');
const toast = (page: import('@playwright/test').Page) => page.locator('[x-text="toastMessage"]');

test('loads the comparator with default cups', async ({ page }) => {
  await expect(page).toHaveTitle(/BaristaLens/);
  await expect(page.getByRole('img', { name: 'Championship 5-Tier Tulip' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Morning Practice Attempt' }).first()).toBeVisible();
});

test('switches comparison modes', async ({ page }) => {
  for (const [label, mode] of [['Crossfade', 'CROSSFADE'], ['Side-by-Side', 'SIDE'], ['Diff Filter', 'DIFF'], ['Split', 'SPLIT']]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(toast(page)).toHaveText(`Switched to ${mode} mode`);
  }
});

test('loads a preset from the pattern library as the practice cup', async ({ page }) => {
  await nav(page).getByRole('button', { name: 'Pattern Library' }).click();
  await expect(page.getByRole('heading', { name: 'Latte Art Pattern Catalog' })).toBeVisible();

  const loadAsPractice = page.getByRole('button', { name: 'Load as Practice (Cup 2)' });
  const card = page
    .locator('div')
    .filter({ has: page.getByRole('heading', { name: 'Winged Barista Swan' }) })
    .filter({ has: loadAsPractice })
    .last();
  await card.locator(loadAsPractice).click();

  await expect(toast(page)).toHaveText('Loaded Winged Barista Swan as Practice (Cup 2)');
  await expect(page.getByRole('img', { name: 'Winged Barista Swan' }).first()).toBeVisible();
});

test('uploads an image into the practice cup', async ({ page }) => {
  // 1x1 transparent PNG
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64',
  );
  await page.locator('input[type="file"]').nth(1).setInputFiles({ name: 'my-pour.png', mimeType: 'image/png', buffer: png });

  await expect(toast(page)).toHaveText('Cup 2 loaded: my-pour');
  await expect(page.getByRole('img', { name: 'my-pour' })).toBeVisible();
});

test('scores a pour, logs it to history, then restores and deletes it', async ({ page }) => {
  await nav(page).getByRole('button', { name: 'SCA Scorecard' }).click();
  await page.getByRole('button', { name: 'Log Pour to History' }).click();
  await expect(toast(page)).toHaveText('Saved pour to History log');

  // History survives a reload via localStorage
  await page.reload();
  await nav(page).getByRole('button', { name: /Pour History \(1\)/ }).click();
  const history = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Pour Practice History' }) });
  await expect(history.getByText('40 / 50', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Restore Session' }).click();
  await expect(toast(page)).toHaveText(/Restored pour from/);

  await nav(page).getByRole('button', { name: /Pour History/ }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'No Practice Sessions Logged Yet' })).toBeVisible();
});

test('exports a snapshot as a PNG download', async ({ page }) => {
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Snapshot' }).click();
  expect((await download).suggestedFilename()).toMatch(/^baristalens-analysis-\d+\.png$/);
});
