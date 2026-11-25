import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';

import { jqueryVersions } from '../jquery-versions.mjs';
for (const { version } of jqueryVersions) {
  for (const artifact of ['jquery.jgrowl.js', 'jquery.jgrowl.min.js']) {
    test.describe(`jQuery ${version}, ${artifact}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setContent('<main id="host"></main><div id="custom" class="bottom-left"></div>');
        await page.addStyleTag({ path: resolve(artifact.endsWith('.min.js') ? 'jquery.jgrowl.min.css' : 'jquery.jgrowl.css') });
        await page.addScriptTag({ path: resolve(`.cache/jquery/${version}.js`) });
        await page.addScriptTag({ path: resolve(artifact) });
      });

      test('animates, accepts clicks, and removes a notification', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.evaluate(() => {
          window.clicked = [];
          jQuery.jGrowl('Click me', {
            header: 'Header', sticky: true, openDuration: 20, closeDuration: 20,
            click: function (notification, message, options, container) {
              window.clicked.push([message, this[0] === notification[0], container.attr('id'), options.sticky]);
            },
          });
        });
        const notification = page.locator('.jGrowl-notification:has(.jGrowl-message)');
        await expect(notification).toBeVisible();
        await expect(notification).toHaveCSS('width', '250px');
        await expect(page.locator('#jGrowl')).toHaveCSS('position', 'fixed');
        await expect(notification.locator('.jGrowl-header')).toHaveText('Header');
        await notification.locator('.jGrowl-message').click();
        await expect.poll(() => page.evaluate(() => window.clicked)).toEqual([['Click me', true, 'jGrowl', true]]);
        await notification.locator('.jGrowl-close').click();
        await expect(notification).toHaveCount(0);
        expect(errors).toEqual([]);
      });

      test('expires timed messages and preserves sticky messages', async ({ page }) => {
        await page.evaluate(() => {
          jQuery.jGrowl('Timed', { life: 30, openDuration: 0, closeDuration: 0 });
          jQuery.jGrowl('Sticky', { sticky: true, openDuration: 0, closeDuration: 0 });
        });
        await expect(page.locator('.jGrowl-message', { hasText: 'Timed' })).toBeVisible();
        await expect(page.locator('.jGrowl-message', { hasText: 'Timed' })).toHaveCount(0);
        await expect(page.locator('.jGrowl-message', { hasText: 'Sticky' })).toBeVisible();
      });

      test('supports nested placement, Bootstrap groups, close all, and restart', async ({ page }) => {
        await page.evaluate(() => {
          jQuery.jGrowl.defaults.appendTo = '#host';
          jQuery.jGrowl.defaults.closerTemplate = '<div class="alert alert-info">Close All</div>';
          jQuery.jGrowl('One', { sticky: true, group: 'alert-success' });
          jQuery.jGrowl('Two', { sticky: true, group: 'alert-danger' });
          jQuery('#custom').jGrowl({ message: 'Independent', sticky: true, glue: 'before' });
        });
        await expect(page.locator('#host #jGrowl .alert-success')).toBeVisible();
        await expect(page.locator('#host #jGrowl .alert-danger')).toBeVisible();
        await page.locator('#host .jGrowl-closer').click();
        await expect(page.locator('#host .jGrowl-message')).toHaveCount(0);
        await expect(page.locator('#custom .jGrowl-message')).toHaveText('Independent');
        await page.evaluate(() => {
          jQuery('#custom').jGrowl('shutdown');
          jQuery('#custom').jGrowl('Restarted', { sticky: true });
        });
        await expect(page.locator('#custom .jGrowl-message')).toHaveText('Restarted');
      });
    });
  }
}
