// Group A6 (owner): I29 auto-fill set through the builder (ADVANCED → Fill from), then checked on the create form and by API.
const T = (await mods()).find(m => /qa_mf_types$/.test(m.moduleKey)); const L = (await defLayout(T.id)).id;
const openForm = async () => { await go(`/modules/${T.id}`, 8000); await page.mouse.click(678, 28); await sleep(1200); const it = page.getByText('QA MF Types1', { exact: true }).last(); await it.waitFor({ timeout: 15000 }); await it.click(); await sleep(4000); };
await step('I29', async () => {
  const stop = capOn(); await builder(T.id, L);
  const setFill = async (label, pickRe) => { await fieldMenu(label); await props('ADVANCED'); const sel = page.locator('select').filter({ has: page.locator('option', { hasText: /auto-fill/i }) }).last(); const opts = await sel.evaluate(e => [...e.options].map(o => o.value + '=' + o.text)); const v = await sel.evaluate((e, re) => ([...e.options].find(o => new RegExp(re, 'i').test(o.text)) || {}).value, pickRe); if (v) await sel.selectOption(v); await sleep(700);
    const sub = await page.locator('select').evaluateAll(es => es.map(e => [...e.options].map(o => o.text).slice(0, 6).join('/'))); await page.getByRole('button', { name: /^Apply$/ }).last().click(); await sleep(800); return `${label}: options [${opts.join(', ')}] chose ${v}; selects now ${JSON.stringify(sub).slice(0, 200)}`; };
  const a = await setFill('QA MF af', 'logged|current user|signed'); const b = await setFill('QA MF af2', 'another field|field|record');
  await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(4000); stop();
  const lay = JSON.stringify(await getLayout(T.id, L)); const stored = (lay.match(/"autoFill":\{[^}]*\}/g) || []).slice(0, 2).join(' ');
  await openForm(); const af = await page.getByPlaceholder('QA MF af', { exact: true }).inputValue().catch(() => '?');
  await page.getByPlaceholder('QA MF txt').fill('typed by QA').catch(() => { }); await sleep(1200); const af2 = await page.getByPlaceholder('QA MF af2').inputValue().catch(() => '?');
  await page.getByPlaceholder('QA MF af', { exact: true }).fill('manual value').catch(() => { }); await page.getByPlaceholder('QA MF txt').fill('typed again').catch(() => { }); await sleep(1000); const afKeep = await page.getByPlaceholder('QA MF af', { exact: true }).inputValue().catch(() => '?');
  const s = await shot('I29-autofill-form'); await page.keyboard.press('Escape');
  rec('I29', 'INFO', `${a} || ${b} || stored ${stored}; writes ${cap.filter(c => /layouts|fields/.test(c)).length}; form: af (logged-in user) = ${JSON.stringify(af)}; af2 after typing qa_txt = ${JSON.stringify(af2)}; af after typing a manual value then changing qa_txt = ${JSON.stringify(afKeep)}`, { shot: s });
});
return done();
