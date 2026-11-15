const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const LID = 'c5bbf73c-0a86-48b4-a8bc-4f394b4e11e5'; const M = process.env.FPM; const R = { posts: [] };
page.on('response', async r => { if (r.request().method() === 'POST' && /\/records(\?|$)/.test(r.url())) R.posts.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); });
await page.goto(H + '/modules/' + MID + '/records/new?layout=' + LID, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(3000);
const fill = async (f, v) => { const i = page.locator(`[data-rule-field="${f}"]`).first().locator('input,textarea').first(); if (!(await i.count())) { R['no_' + f] = 1; return; } await i.fill(v, { timeout: 5000 }).catch(() => { R['nofill_' + f] = 1; }); await i.press('Tab').catch(() => {}); await sleep(500); };
await fill('first_name', 'QA RT18 H6 ui ' + M); await fill('last_name', 'QA RT18 H6 ui ' + M);
const note = page.locator('[data-rule-field="qa_rt18v_note"]').first(); R.noteShown = await note.count() ? await note.isVisible() : false;
if (R.noteShown) { const i = note.locator('input').first(); R.noteState = await i.evaluate(e => ({ disabled: e.disabled, ro: e.readOnly, aria: e.getAttribute('aria-readonly') })); await note.scrollIntoViewIfNeeded(); }
else await page.getByText('QA RT18 VR', { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
await sleep(800); await shot('3010-' + (M === 'hidden' ? '3' : '1') + '-u1-form-' + M + '.png');
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000);
R.url = page.url().replace(H, ''); R.saved = !R.url.includes('/new'); R.err = ((await text()).replace(/\s+/g, ' ').match(/.{0,60}H6 note is required.{0,40}/) || [null])[0];
await shot('3010-' + (M === 'hidden' ? '4' : '2') + '-u1-saved-' + M + '.png');
return R;
