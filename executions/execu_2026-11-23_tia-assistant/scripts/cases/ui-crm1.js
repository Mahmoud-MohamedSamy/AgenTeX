const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(4000);
log('crm launcher', await page.locator('[data-testid="tia-launcher"]').count(), page.url());
await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(1500);
await page.locator(`${P} button[aria-label="New chat"]`).click(); await page.waitForTimeout(1500);
log('crm suggestions', (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 400)); await shot('H07-crm-suggestions');
// H-23 history across apps
await page.locator(`${P} button[aria-label="Past chats"]`).click(); await page.waitForTimeout(1500);
log('crm history first rows', (await page.locator('[data-testid="tia-history-row"]').evaluateAll(r => r.slice(0, 6).map(x => x.innerText.split('\n')[0]))).join(' | '));
await page.locator(`${P} button[aria-label="New chat"]`).click(); await page.waitForTimeout(1000);
// K-16 xss render
const ta = page.locator(`${P} textarea`);
let dialogs = 0; page.on('dialog', d => { dialogs++; d.dismiss(); });
await ta.fill('Find the contact with email qa.tia.xss@example.com and tell me its full name exactly.'); await ta.press('Enter');
await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply-text"]').length >= 1, null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(3000);
await shot('K16-xss-render');
log('xss imgs in panel', await page.locator(`${P} img`).count(), 'dialogs', dialogs, 'text', (await page.locator('[data-testid="tia-reply-text"]').last().innerText()).slice(0, 200));
// J-01 UI card
await ta.fill('Create a new lead: first name QA TIA, last name UI Card, company QA Co, email qa.tia.uicard@example.com.'); await ta.press('Enter');
await page.locator('[data-testid="tia-action-card"]').first().waitFor({ timeout: 90000 }).catch(() => {}); await page.waitForTimeout(2000);
await shot('J01-card-ui');
log('card', (await page.locator('[data-testid="tia-action-card"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 600));
// J-21 reload with card waiting
await page.reload(); await page.waitForTimeout(5000); if (!(await page.locator(P).count())) { await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(2000); }
await page.waitForTimeout(2000); await shot('J21-card-after-reload'); log('after reload card', await page.locator('[data-testid="tia-action-card"]').count(), (await page.locator('[data-testid="tia-action-card"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 300));
// J-03 cancel in UI
const cancel = page.locator('[data-testid="tia-action-card"] button', { hasText: 'Cancel' }).last();
if (await cancel.count()) { await cancel.click(); await page.waitForTimeout(3000); await shot('J03-cancel-ui'); log('after cancel', (await page.locator('[data-testid="tia-action-card"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 200)); }
return 'ok';
