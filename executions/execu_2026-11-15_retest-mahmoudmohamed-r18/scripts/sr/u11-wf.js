const out = { req: [] };
page.on('response', async r => { const m = r.request().method(); if (m !== 'GET' && /workflow/.test(r.url())) out.req.push(m + ' ' + r.url().replace(/.*\/api\/v1/, '') + ' ' + r.status()); });
await go('/settings/automation/workflow-rules', 8000);
await page.getByRole('button', { name: 'New Rule' }).first().click(); await sleep(3000); await shot('2938-0-new.png');
out.step1 = (await bodyText()).match(/(Create New Rule|New Workflow|Module).{0,300}/)?.[0];
const sel = page.locator('select').first();
if (await sel.count()) { await sel.selectOption({ label: 'Leads' }).catch(() => {}); } else { await page.getByText(/Select a module/).first().click().catch(() => {}); await sleep(800); await page.locator('[role=option]').filter({ hasText: /^Leads$/ }).first().click().catch(() => {}); }
await sleep(800); await page.getByRole('textbox').first().fill('QA RT18 SR G9 ui').catch(() => {});
out.beforeNext = (await bodyText()).slice(-700); await page.getByRole('button', { name: /^Next$/ }).click({ timeout: 10000 }); await sleep(3000);
const sv = page.getByText(/Score value/).first(); out.hasScore = await sv.count(); if (out.hasScore) { await sv.click(); await sleep(1500); }
const picker = page.getByTestId('score-trigger-picker'); out.picker = await picker.count();
out.pickerText = (await picker.innerText()).replace(/\s+/g, ' ');
await picker.getByTestId('score-threshold-toggle').check(); await sleep(500);
const inp = picker.getByLabel(/Score threshold/); out.default = await inp.inputValue(); out.inputs = [];
for (const v of ['', 'abc', '12.5', '999999999999999999', '-20', 'abc']) { await inp.fill(v).catch(async () => { await inp.click(); await page.keyboard.press('Control+A'); await page.keyboard.type(v); }); await inp.blur(); await sleep(600);
  out.inputs.push(JSON.stringify(v) + ' => ' + JSON.stringify(await inp.inputValue()) + ' invalid=' + (await inp.getAttribute('aria-invalid')) + ' desc=' + (await inp.getAttribute('aria-describedby')) + ' msg=' + ((await picker.innerText()).replace(/\s+/g, ' ').match(/[^.]{0,30}(whole number|valid|Enter|number)[^.]{0,60}/i) || [''])[0]);
  if (v === '12.5') await shot('2938-1-decimal.png'); }
out.inputType = await inp.getAttribute('type');
out.pickerNow = (await picker.innerText()).replace(/\s+/g, ' ');
await shot('2938-2-abc.png');
const cr = page.getByRole('button', { name: /^Create$/ }).last(); out.createDisabled = await cr.isDisabled().catch(() => null);
if (!out.createDisabled) { await cr.click().catch(e => out.clickErr = e.message.slice(0, 80)); await sleep(3000); }
out.after = ((await bodyText()).match(/[^.]{0,80}(threshold|whole number|rises to|score of a record)[^.]{0,120}/gi) || []).slice(0, 4);
out.url = page.url();
await shot('2938-3-create.png');
return out;
