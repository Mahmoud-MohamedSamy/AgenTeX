const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(3000);
const open = async () => { if (!(await page.locator(P).count())) { await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(1500); } };
await open();
const btn = async label => page.locator(`${P} button[aria-label="${label}"], ${P} button[title="${label}"]`).first();
const names = await page.$$eval(`${P} button`, b => b.map(x => x.getAttribute('aria-label') || x.title || x.innerText.trim()).filter(Boolean));
log('buttons', names.join(' | '));
// H-17 new chat → welcome + suggestions (H-06/H-07)
await (await btn('New chat')).click(); await page.waitForTimeout(1500);
await shot('H07-new-chat-desk');
log('newchat text', (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 700));
// H-09 click a suggestion
const sug = page.locator(`${P} button`, { hasText: 'What can you help me with?' });
log('sugg what', await sug.count());
if (await sug.count()) { await sug.first().click(); await page.waitForTimeout(800); const busy = await page.locator('[data-testid="tia-launcher-busy"], [data-testid="tia-thinking"]').count(); log('busy/thinking during', busy); await page.locator('[data-testid="tia-reply-text"]').first().waitFor({ timeout: 90000 }).catch(() => {}); await page.waitForTimeout(2000); await shot('H09-suggestion-answer'); log('after sugg', (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 500)); }
// H-13 references
const ta = page.locator(`${P} textarea`);
await ta.fill('Show me the ticket QA TIA T2 and its status.'); await ta.press('Enter');
await page.waitForTimeout(1000); await shot('H10-streaming');
await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply"]').length >= 2, null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(2500);
await shot('H13-references');
log('refs', await page.locator('[data-testid="tia-refs"]').count(), (await page.locator('[data-testid="tia-refs"]').last().innerText().catch(() => '')).slice(0, 200));
const refLink = page.locator('[data-testid="tia-refs"] a, [data-testid="tia-refs"] button').last();
if (await refLink.count()) { const href = await refLink.getAttribute('href'); log('ref href', href); }
// H-14 Shift+Enter and empty
await ta.fill(''); log('send disabled when empty', await page.locator(`${P} button[aria-label="Send"]`).isDisabled().catch(() => 'n/a'));
await ta.type('line one'); await ta.press('Shift+Enter'); await ta.type('line two'); log('shift-enter value', JSON.stringify(await ta.inputValue()));
await ta.fill('');
return 'ok';
