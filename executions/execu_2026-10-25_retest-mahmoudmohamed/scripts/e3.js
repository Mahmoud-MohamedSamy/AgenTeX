// NDC-2117: view-name validation messages in the custom view editor.
for (let k = 0; k < 90; k++) { await sleep(1000); if (await page.locator('input[maxlength="120"], input[placeholder*="name" i]').count()) break; }
const name = page.locator('input[maxlength="120"]').first().or(page.locator('input[placeholder*="name" i]').first()).first();
const msgs = async () => { const t = await txt(); return ['Enter a name for the view.', 'A view name can be at most 120 characters.', 'You already have a view with this name.'].filter(m => t.includes(m)); };
const saveBtn = page.getByRole('button', { name: /^Save$/ }).last();
const out = { maxlength: await name.getAttribute('maxlength') };
// empty: type then clear, then blur
await name.fill('x'); await name.fill(''); await page.keyboard.press('Tab'); await sleep(800);
out.empty = { msgs: await msgs(), saveEnabled: await saveBtn.isEnabled() }; await shot('2117-01-empty');
await name.fill('   '); await page.keyboard.press('Tab'); await sleep(800);
out.spaces = { msgs: await msgs(), saveEnabled: await saveBtn.isEnabled() }; await shot('2117-02-spaces');
await name.fill('QA RT ' + 'x'.repeat(114)); await sleep(600);
out.at120 = { len: (await name.inputValue()).length, msgs: await msgs() }; await shot('2117-03-120');
await name.click(); await page.keyboard.press('End'); await page.keyboard.type('y'); await sleep(600);
out.type121 = { len: (await name.inputValue()).length, msgs: await msgs() };
await name.fill('QA RT ' + 'x'.repeat(115)); await sleep(600);
out.paste121 = { len: (await name.inputValue()).length, msgs: await msgs() };
// duplicate (case-insensitive)
await name.fill('qa rt 2098 LAST'); await sleep(500);
out.dupBeforeSave = { msgs: await msgs(), saveEnabled: await saveBtn.isEnabled() };
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/views/.test(q.url())) resp.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); }; page.on('response', f);
if (await saveBtn.isEnabled()) { await saveBtn.click(); await sleep(3500); }
page.off('response', f);
out.dupAfterSave = { msgs: await msgs(), resp, url: page.url().replace(/.*\/views/, '/views') }; await shot('2117-04-duplicate');
return done(out);
