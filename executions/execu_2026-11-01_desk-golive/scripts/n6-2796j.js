const o = {};
await page.goto(H + '/views/all/tickets/28a63f16-3f8d-429f-8cac-1c692f9d9b90', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA RT 2796 Accounting form/.test(t) && /Ticket Owner/.test(t)) break; }
await sleep(2000); await page.mouse.click(1569, 103); await sleep(1200);
await page.getByRole('menuitem', { name: /Change Layout/ }).click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
const d = page.locator('[role=dialog]');
await d.getByText('QA NDC FLY-WT Refund', { exact: true }).first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(600);
await d.locator('button', { hasText: /^Change layout$/ }).click().catch(e => o.e2 = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 8; i++) { await sleep(800); t = (await txt()).replace(/\s+/g, ' '); if (/not used by|department|refused|can't|cannot/i.test(t.slice(-600))) break; }
o.toast = t.match(/.{0,60}(not (assigned|used)|isn't used|department does not|cannot use|can't use)[^.]{0,100}/i)?.[0];
o.dialogOpen = await d.count(); o.flyFields = /QA NDC Refund amount|QA NDC 4-Account Number|QA NDC TKT\/PNR/.test(t);
o.shot = await shot('rt/2796-other-dept-layout');
return JSON.stringify(o);
