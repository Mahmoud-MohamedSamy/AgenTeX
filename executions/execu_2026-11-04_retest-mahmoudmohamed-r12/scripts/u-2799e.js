const o = {}; const net = [];
page.on('response', async r => { const u = r.url(); if (/draft/i.test(u) && !/blueprints\/[^/]+\/draft/.test(u)) net.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*api\/v1/, '').slice(0, 120)); });
const T = '21c252e5-339e-4d81-ad03-941f46cd27fe';
const open = async () => { await page.goto(H + '/views/all/tickets/' + T, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2799 escalation/.test(await text()) && /QA go/.test(await text())) break; } await sleep(3000); };
await open();
await page.getByRole('button', { name: /^QA go/ }).first().click(); await sleep(3000);
const amt = page.locator('xpath=//*[contains(normalize-space(text()),"QA NDC Amount")]/following::input[1]').first(); await amt.fill('7'); await sleep(800);
await page.getByRole('button', { name: 'Save draft' }).click(); await sleep(4000); o.toast1 = ((await text()).match(/[^\n]*draft[^\n]*/gi) || []).slice(0, 4);
await shot('2799-h-draft-saved.png');
await open(); o.buttonAfterReload = (await page.getByRole('button', { name: /^QA go/ }).first().innerText()).replace(/\s+/g, ' ');
await page.getByRole('button', { name: /^QA go/ }).first().click(); await sleep(3000);
o.amountBack = await page.locator('xpath=//*[contains(normalize-space(text()),"QA NDC Amount")]/following::input[1]').first().inputValue().catch(() => null);
await shot('2799-i-draft-reopened.png');
// close typed form → Save draft / Discard / Keep editing
await page.locator('xpath=//*[contains(normalize-space(text()),"QA NDC Amount")]/following::input[1]').first().fill('9'); await sleep(500);
await page.getByRole('button', { name: 'Cancel' }).first().click(); await sleep(2000); o.closePrompt = ((await page.getByRole('dialog').last().innerText().catch(() => '')) || '').slice(0, 300);
await page.getByRole('button', { name: /Keep editing/i }).click().catch(() => {}); await sleep(1000);
// run → draft gone
await page.locator('xpath=//*[contains(normalize-space(text()),"QA NDC Amount")]/following::input[1]').first().fill('7');
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(6000);
o.afterRun = ((await text()).match(/QA end[^\n]*|Escalated[^\n]*/g) || []).slice(0, 3);
o.drafts = (await page.evaluate(async t => { const r = await fetch('/api/v1/desk/tickets/' + t + '/drafts', { credentials: 'include' }); return r.status; }, T).catch(() => null));
o.net = net.slice(0, 10); return o;
