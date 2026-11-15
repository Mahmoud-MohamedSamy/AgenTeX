const out = {};
await go('/settings/modules-and-fields/' + MID + '/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288', 10000);
await page.getByText('New Fields', { exact: true }).first().click(); await sleep(800);
await page.getByText(/Unused Fields/i).first().click(); await sleep(1500);
await page.getByPlaceholder('Search by name or API name').fill('qa_rt18sr'); await sleep(1500);
const el = page.getByText('QA RT18SR NUM', { exact: true }).first(); await el.hover(); await sleep(600);
const row = el.locator('xpath=ancestor::*[.//button][1]'); out.rowBtns = await row.locator('button').evaluateAll(e => e.map(x => (x.getAttribute('aria-label') || x.title || x.innerText).trim()));
out.rowBox = await box(row);
await shot('2935-3-unused.png');
const del = row.locator('button[aria-label*=elete], button[title*=elete]').first(); out.del = await del.count();
if (!out.del) { const more = row.locator('button').last(); await more.click(); await sleep(700); out.menu = await page.locator('[role=menu]').allInnerTexts(); const mi = page.getByRole('menuitem', { name: /Delete/ }); if (await mi.count()) await mi.first().click(); }
else await del.click();
await sleep(6000); out.dialog1 = (await page.locator('[role=dialog], [role=alertdialog]').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 400));
await shot('2935-4-confirm.png');
const resp = page.waitForResponse(r => /\/fields\//.test(r.url()) && r.request().method() === 'DELETE', { timeout: 10000 }).catch(() => null);
const ok = page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /^(Delete|Confirm|Yes|Delete permanently)/ }).last(); out.ok = await ok.count();
if (out.ok) { await ok.click(); const r = await resp; out.delResp = r ? r.status() + ' ' + (await r.text()).slice(0, 300) : 'no DELETE'; await sleep(2000); }
out.after = (await bodyText()).match(/.{0,80}(scoring rule|in use|used by|FIELD_IN_USE).{0,250}/gi)?.slice(0, 3);
await shot('2935-5-refused.png');
out.stillThere = await page.getByText('QA RT18SR NUM', { exact: true }).count();
return out;
