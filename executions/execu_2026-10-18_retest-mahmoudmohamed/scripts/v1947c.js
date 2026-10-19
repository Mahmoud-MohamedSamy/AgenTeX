const out = { calls: [] };
const fr = async r => { const m = r.request().method(); if (m !== 'GET' && /\/views|list-preferences/.test(r.url())) out.calls.push(r.status() + ' ' + m + ' ' + r.url().replace(API, '').slice(0, 120)); }; page.on('response', fr);
for (let i = 0; i < 30 && !(await page.getByRole('button', { name: 'Manage columns' }).count()); i++) await sleep(1000);
out.view = (await page.locator('button[aria-label="Custom views"]').innerText().catch(() => '')).trim();
await page.getByRole('button', { name: 'Manage columns' }).click(); await sleep(2000);
const dlg = page.locator('[role=dialog]').last(); await dlg.locator('button[aria-label^="Hide "]:not([disabled])').first().click(); await sleep(500);
await dlg.getByRole('button', { name: 'Apply' }).click(); await sleep(3000);
out.banner = ((await txt()).match(/[^\n]*(changed the columns|Only you see|Save|view's columns)[^\n]*/gi) || []).slice(0, 6);
out.bannerButtons = (await page.getByRole('button').allInnerTexts()).filter(t => /save|view's columns|reset/i.test(t)).slice(0, 6);
await shot('NDC-1947-user2-own-view-columns');
const sv = page.getByRole('button', { name: /Save (to|as) view|Save view|Save changes/i }).first(); out.saveBtn = await sv.count();
if (out.saveBtn) { await sv.click(); await sleep(4000); await shot('NDC-1947-user2-own-view-saved'); out.after = ((await txt()).match(/[^\n]*(saved|updated)[^\n]*/gi) || []).slice(0, 3); }
page.off('response', fr); return done(out);
