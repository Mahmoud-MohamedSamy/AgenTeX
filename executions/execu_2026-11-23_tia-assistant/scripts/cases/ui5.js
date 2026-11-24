const P = '[data-testid="tia-panel"]'; let dialogs = 0; page.on('dialog', d => { dialogs++; d.dismiss(); });
await go('/'); await page.waitForTimeout(3000);
const open = async () => { if (!(await page.locator(P).count())) { await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(1500); } };
await open(); await page.locator(`${P} button[aria-label="New chat"]`).click(); await page.waitForTimeout(1000);
const ta = page.locator(`${P} textarea`);
const send = async (q, n) => { await ta.fill(q); await ta.press('Enter'); await page.waitForFunction(n => document.querySelectorAll('[data-testid="tia-reply"]').length >= n, n, { timeout: 120000 }).catch(() => {}); await page.waitForTimeout(2500); };
// K-16 UI
await send('Find the open ticket whose subject ends with T5 and tell me its exact subject.', 1);
await shot('K16-xss-render-desk'); log('K16 imgs', await page.locator(`${P} img`).count(), 'dialogs', dialogs, 'reply', (await page.locator('[data-testid="tia-reply-text"]').last().innerText()).slice(0, 200));
// J-01 UI card (kb draft)
await send('Write a knowledge base article draft titled "QA TIA UI draft" with 2 short steps.', 2);
await page.locator('[data-testid="tia-action-card"]').first().waitFor({ timeout: 60000 }).catch(() => {});
await shot('J01-card-ui-desk'); log('card', (await page.locator('[data-testid="tia-action-card"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 500));
log('card testids', (await page.$$eval('[data-testid^="tia-action"]', e => [...new Set(e.map(x => x.getAttribute('data-testid')))])).join(' '));
// J-21 reload
await page.reload(); await page.waitForTimeout(5000); await open(); await page.waitForTimeout(2500);
await shot('J21-card-after-reload'); log('after reload cards', await page.locator('[data-testid="tia-action-card"]').count(), 'confirm btn', await page.locator('[data-testid="tia-action-card"] button', { hasText: 'Confirm' }).count());
// M-11 keyboard cancel
const cancel = page.locator('[data-testid="tia-action-card"] button', { hasText: 'Cancel' }).last();
if (await cancel.count()) { await cancel.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(3000); await shot('J03-cancel-ui'); log('after cancel', (await page.locator('[data-testid="tia-action-card"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 200), 'announcer', (await page.locator('[data-testid="tia-announcer"]').innerText().catch(() => '')).slice(0, 120)); }
// J-14 lost on the way: new card, go offline right after Confirm
await send('Write a knowledge base article draft titled "QA TIA offline draft" with 1 short step.', 3);
await page.locator('[data-testid="tia-action-card"] button', { hasText: 'Confirm' }).last().waitFor({ timeout: 60000 }).catch(() => {});
const conf = page.locator('[data-testid="tia-action-card"] button', { hasText: 'Confirm' }).last();
if (await conf.count()) { await page.route('**/agents/tia/actions/**/confirm', r => r.abort('failed')); await conf.click(); await page.waitForTimeout(2500); await shot('J14-lost-1'); log('lost msg', (await page.locator('[data-testid="tia-action-card"]').last().innerText()).replace(/\n+/g, ' / ').slice(0, 300)); await page.unroute('**/agents/tia/actions/**/confirm'); await page.waitForTimeout(8000); const chk = page.locator('[data-testid="tia-action-card"] button', { hasText: /Check again|Confirm/ }).last(); log('buttons now', (await page.locator('[data-testid="tia-action-card"]').last().locator('button').allInnerTexts()).join('|')); await shot('J14-lost-2'); }
return 'ok';
