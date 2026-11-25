import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

test.describe('demo pages', () => {
  let errors = [];
  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('https://jgrowl.test/**', async (route) => {
      const path = new URL(route.request().url()).pathname;
      await route.fulfill({
        body: await readFile(resolve('.' + path)),
        contentType: contentTypes[extname(path)] || 'application/octet-stream',
      });
    });
    await page.route('https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/**', async (route) => {
      const filename = new URL(route.request().url()).pathname.split('/').pop();
      await route.fulfill({
        body: await readFile(resolve('.cache/bootstrap', filename)),
        contentType: contentTypes[extname(filename)],
        headers: { 'access-control-allow-origin': '*' },
      });
    });
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('runs the main demo callbacks, themes, custom container, and shutdown', async ({ page }) => {
    const output = [];
    page.on('console', (message) => output.push(message.text()));
    await page.goto('https://jgrowl.test/examples/jgrowl.html');
    const themed = page.locator('#jGrowl .manilla');
    await expect(themed).toBeVisible();
    await expect(themed.locator('.jGrowl-header')).toHaveText('Header');
    await expect(themed).toHaveCSS('background-color', 'rgb(255, 241, 194)');
    await expect.poll(() => output.some((line) => line.includes('I have been opened!'))).toBe(true);
    await expect(page.locator('#logs')).toContainText('Custom theme, custom animations');
    await expect(page.locator('#jGrowl .jGrowl-message', { hasText: "Sticky notifications don't have an end of life" })).toBeVisible();
    await expect(page.locator('#jGrowl .jGrowl-message', { hasText: 'This message will not open' })).toHaveCount(0);
    const customMessages = page.locator('#test1 .jGrowl-message');
    await expect(customMessages).toHaveText(['This will be prepended before the last message.', 'Testing a custom container.']);
    await themed.locator('.jGrowl-close').click();
    await expect(themed).toHaveCount(0);
    await expect.poll(() => output.some((line) => line.includes('I have been closed!'))).toBe(true);
    const protectedNotification = page.locator('#jGrowl .jGrowl-notification').filter({ hasText: 'This message will not close' });
    await expect(protectedNotification).toBeVisible();
    await protectedNotification.locator('.jGrowl-close').click();
    await expect(protectedNotification).toBeVisible();
    await page.getByText('Shutdown bottom-left container.', { exact: true }).click();
    await expect(customMessages).toHaveCount(0);
    await expect(page.locator('#test1')).not.toHaveClass(/\bjGrowl\b/);
  });

  test('appends notifications to the demo navigation and preserves its sticky message', async ({ page }) => {
    await page.goto('https://jgrowl.test/examples/appendTo.html');
    const heading = await page.getByRole('heading', { name: 'Append To Another DOM-Object' }).boundingBox();
    const navigation = await page.locator('#dummyNav').boundingBox();
    expect(heading.y).toBeGreaterThanOrEqual(navigation.y + navigation.height);
    const messages = page.locator('#dummyNav > #jGrowl .jGrowl-message');
    await expect(messages).toHaveText(['This message is sticky and clickable', ...Array(6).fill('This message expires automatically.')]);
    await expect(page.locator('#dummyNav .jGrowl-closer')).toHaveText('[ xxxxx ]');
    expect(await messages.first().evaluate((element) => jQuery(element).parent().data('jGrowl').sticky)).toBe(true);
    page.once('dialog', (dialog) => dialog.accept());
    await messages.first().click();
    await page.locator('#dummyNav .jGrowl-closer').click();
    await expect(messages).toHaveCount(0);
    await expect(page.locator('#dummyNav')).toContainText("I'm the dummy navigation");
  });

  test('runs the Bootstrap demo alerts and responsive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await page.goto('https://jgrowl.test/examples/bootstrap.html');
    const notification = page.locator('#jGrowl-container1 .jGrowl-notification:has(.jGrowl-message)').first();
    await expect(notification).toBeVisible();
    await expect(notification).toHaveClass(/alert-(success|info|warning|danger)/);
    await expect(notification.locator('.jGrowl-header')).toHaveText(/^(Success|Info|Warning|Danger) Notification$/);
    await expect(notification.locator('.jGrowl-message')).toHaveText('Hello world');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await expect(page.getByRole('link', { name: 'About', exact: true })).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(page.locator('#navbar-navigation')).toHaveClass(/\bshow\b/);
    const about = page.getByRole('link', { name: 'About', exact: true });
    expect(await about.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      return element.contains(hit);
    })).toBe(true);
    await about.click();
    await expect(page).toHaveURL(/#about$/);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('link', { name: 'About', exact: true })).toBeHidden();
    const closer = page.locator('#jGrowl-container1 .jGrowl-closer');
    await expect(closer).toBeVisible();
    await expect(closer).toHaveText('Close All');
    await expect(closer).toHaveClass(/alert-info/);
    await closer.click();
    await expect(page.locator('#jGrowl-container1 .jGrowl-message')).toHaveCount(0);
  });
});
