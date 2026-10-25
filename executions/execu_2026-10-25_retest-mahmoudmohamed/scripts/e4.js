// NDC-2117: exact-case duplicate name in the editor, plus API duplicate checks (exact, case-only, trailing space).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAYOUT = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
await go(`/modules/${L}/views/new?layout=${LAYOUT}`, 500);
for (let k = 0; k < 90; k++) { await sleep(1000); if (await page.locator('input[maxlength="120"]').count()) break; }
const name = page.locator('input[maxlength="120"]').first();
const saveBtn = page.getByRole('button', { name: /^Save$/ }).last();
const out = {};
await name.fill('QA RT 2098 last'); await page.keyboard.press('Tab'); await sleep(800);
out.exactBeforeSave = { hasMsg: (await txt()).includes('You already have a view with this name.'), saveEnabled: await saveBtn.isEnabled() };
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/views/.test(q.url())) resp.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); }; page.on('response', f);
if (await saveBtn.isEnabled()) { await saveBtn.click(); await sleep(3500); }
page.off('response', f);
out.exactAfterSave = { hasMsg: (await txt()).includes('You already have a view with this name.'), resp, stayedInEditor: /\/views\/new/.test(page.url()) };
await shot('2117-05-duplicate-exact');
const post = async n => { const r = await api('POST', `/modules/${L}/views`, { name: n, kind: 'list', visibility: 'private', settings: { criteria: { conditions: [] } } }); return { status: r.status, id: r.body?.data?.id, msg: r.body?.error?.message || r.body?.message || '' }; };
out.apiExact = await post('QA RT 2098 last');
out.apiUpper = await post('QA RT 2098 LAST');
out.apiTrail = await post('QA RT 2098 last ');
out.apiEmpty = await post('   ');
out.api121 = await post('QA RT ' + 'z'.repeat(115));
return done(out);
