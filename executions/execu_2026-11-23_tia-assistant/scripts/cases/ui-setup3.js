await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(2000);
await page.locator('[data-testid="tia-summary-card"] button', { hasText: 'Edit' }).click(); await page.waitForTimeout(2500);
const dlg = page.locator('[role=dialog]').last();
for (const tab of ['Tools', 'Knowledge Base', 'Additional Settings']) { await dlg.getByText(tab, { exact: true }).first().click().catch(() => {}); await page.waitForTimeout(1500); await shot('E01-tab-' + tab.replace(/ /g, '')); log(tab, (await dlg.innerText()).replace(/\n+/g, ' / ').slice(0, 1300)); }
await dlg.locator('button', { hasText: 'Cancel' }).first().click().catch(() => {}); await page.waitForTimeout(1000);
await page.getByText('Tia Assistant', { exact: true }).first().click().catch(e => log('menu err', e.message.slice(0, 60))); await page.waitForTimeout(4000);
log('Tia Assistant menu → url', page.url(), (await text()).replace(/\n+/g, ' / ').slice(0, 300)); await shot('B01-tia-assistant-menu');
return 'ok';
