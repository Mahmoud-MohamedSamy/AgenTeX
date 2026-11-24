const P = '[data-testid="tia-panel"]';
await go('/views/all/tickets/c13edb67-987c-444e-a414-9f8e06410b4f');
await page.waitForFunction(() => document.body.innerText.includes('QA TIA T1'), null, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2000); log('ticket loaded', (await text()).includes('QA TIA T1'));
await page.locator('[data-testid="tia-launcher"]').click({ timeout: 60000 }); await page.waitForTimeout(1500);
await page.locator(`${P} button[aria-label="New chat"]`).click(); await page.waitForTimeout(1500);
log('ticket suggestions', (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 500)); await shot('H08-ticket-suggestions');
const s = page.locator(`${P} button`, { hasText: 'Summarise this ticket' });
if (await s.count()) { await s.click(); await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply-text"]').length >= 1, null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(3000); await shot('I14-summarise-this-ticket'); log('summary', (await page.locator('[data-testid="tia-reply-text"]').last().innerText()).slice(0, 700)); }
const d = page.locator(`${P} button`, { hasText: 'Draft a private comment' });
log('draft suggestion', await d.count());
if (await d.count()) { await d.click(); await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply-text"]').length >= 2, null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(3000); await shot('J06-draft-comment-ui'); log('draft answer', (await page.locator('[data-testid="tia-reply-text"]').last().innerText()).slice(0, 400), 'cards', await page.locator('[data-testid="tia-action-card"]').count()); }
return 'ok';
