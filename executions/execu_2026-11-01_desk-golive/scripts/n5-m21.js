const o = {};
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading notification rules/.test(t)) break; }
const sel = page.locator('select').first(); o.sel = await sel.count();
if (o.sel) { const opts = await sel.locator('option').allInnerTexts(); o.opt = opts.filter(x => /Quality/.test(x)); if (o.opt[0]) await sel.selectOption({ label: o.opt[0] }); }
else { const cb = page.locator('[role=combobox]').first(); if (await cb.count()) { await cb.click(); await sleep(1000); await page.getByRole('option', { name: /QA NDC Quality Assurance/ }).first().click().catch(e => o.e = e.message.slice(0, 60)); } }
await sleep(4000);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.search(/TEAM NOTIFICATION|Team notification/i); o.team = i >= 0 ? t.slice(i, i + 900) : t.slice(0, 600);
const h = page.locator('text=/^Team notifications?$/i').first(); if (await h.count()) await h.scrollIntoViewIfNeeded();
await sleep(1000); o.shot = await shot('m21/tavi-team-notif');
return JSON.stringify(o);
