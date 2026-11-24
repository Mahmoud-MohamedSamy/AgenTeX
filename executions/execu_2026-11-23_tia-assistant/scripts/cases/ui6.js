const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(3000);
const open = async () => { if (!(await page.locator(P).count())) { await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(2000); } };
await open();
log('cards visible on open', await page.locator('[data-testid="tia-action-card"]').count(), 'buttons', (await page.locator('[data-testid="tia-action-card"]').last().locator('button').allInnerTexts().catch(() => [])).join('|'));
await shot('J21-card-after-reload');
const c = page.locator('[data-testid="tia-action-card"] button', { hasText: 'Cancel' }).last();
if (await c.count()) { await c.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(3000); log('after keyboard cancel', (await page.locator('[data-testid="tia-action-card"]').last().innerText()).split('\n').slice(-2).join(' / '), '| announcer:', (await page.locator('[data-testid="tia-announcer"]').innerText().catch(() => '')).slice(0, 120)); await shot('J03-cancel-ui'); }
return 'ok';
