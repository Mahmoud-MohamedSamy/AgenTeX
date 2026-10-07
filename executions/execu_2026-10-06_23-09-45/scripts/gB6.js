// Group B6 (admin B): verdicts for I28 (no-controller message), I37 (quick-create trigger set in the builder), I38 (uploads by field).
const T = (await mods()).find(m => /qa_mf_types$/.test(m.moduleKey)); const L = (await defLayout(T.id)).id; const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc';
const openForm = async () => { await go(`/modules/${T.id}`, 8000); await page.mouse.click(678, 28); await sleep(1200); const it = page.getByText('QA MF Types1', { exact: true }).last(); await it.waitFor({ timeout: 15000 }); await it.click(); await sleep(4000); };
await step('I28', async () => {
  const DL = (await defLayout(DM)).id; await builder(DM, DL); await fieldMenu('Name'); await props('VALIDATION');
  const sw = page.getByText('Conditional visibility', { exact: true }).locator('xpath=ancestor::div[.//*[@role="switch"]][1]').getByRole('switch').first(); await sw.click({ timeout: 8000 }).catch(() => { }); await sleep(1200);
  const s = await shot('I28-no-controllers'); const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Conditional visibility');
  const m = t.match(/This layout has no other field[^.]*\./);
  rec('I28', m ? 'PASS' : 'INFO', m ? `"${m[0]}"` : `panel after toggle: "${t.slice(i, i + 300)}"`, { shot: s });
  await page.getByRole('button', { name: /^Cancel$/ }).last().click().catch(() => { });
});
await step('I37', async () => {
  const stop = capOn(); await builder(T.id, L); await fieldMenu('QA MF trig'); await props('ADVANCED'); await sleep(500);
  const before = (await txt()).replace(/\s+/g, ' '); const i = before.search(/quick.?create/i);
  const sels = page.locator('select:visible'); const info = await sels.evaluateAll(es => es.map(e => [...e.options].map(o => o.text).slice(0, 8).join('/')));
  // value select then module select, then Add
  const vs = sels.filter({ has: page.locator('option', { hasText: /^Escalate$/ }) }).first(); if (await vs.count()) await vs.selectOption({ label: 'Escalate' });
  const ms = sels.filter({ has: page.locator('option', { hasText: /^Tasks?$/ }) }).first(); if (await ms.count()) { const lab = await ms.evaluate(e => [...e.options].find(o => /^Tasks?$/.test(o.text)).text); await ms.selectOption({ label: lab }); }
  await page.getByRole('button', { name: /^Add$/ }).last().click().catch(() => { }); await sleep(600);
  await page.getByRole('button', { name: /^Apply$/ }).last().click().catch(() => { }); await sleep(800); await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(3500); stop();
  const stored = (JSON.stringify(await getLayout(T.id, L)).match(/"quickCreateTriggers":\[[^\]]*\]/g) || []).slice(0, 1).join('');
  await openForm(); const row = page.getByText('QA MF trig', { exact: true }).first().locator('xpath=ancestor::*[.//*[@role="combobox"] or .//select or .//button[contains(.,"Select")]][1]');
  const sl = row.locator('select'); if (await sl.count()) await sl.first().selectOption('Escalate'); else { await row.locator('[role=combobox], button').first().click().catch(() => { }); await sleep(700); const o = page.getByRole('option', { name: 'Escalate', exact: true }); if (await o.count()) await o.first().click(); else await page.getByText('Escalate', { exact: true }).last().click().catch(() => { }); }
  await sleep(3000); const dl = (await page.locator('[role=dialog]').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').slice(0, 120)); const s = await shot('I37-after-escalate');
  rec('I37', dl.some(d => /Task/i.test(d)) ? 'PASS' : 'INFO', `builder ADVANCED quick-create text "${before.slice(i, i + 160)}"; selects ${JSON.stringify(info).slice(0, 200)}; stored ${stored}; after choosing Escalate on the form: dialogs ${JSON.stringify(dl).slice(0, 200)}`, { shot: s });
  await page.keyboard.press('Escape'); await sleep(400); await page.keyboard.press('Escape');
});
await step('I38', async () => {
  await openForm(); const TD = RUN + '/testdata/'; const out = [];
  const inputFor = lab => page.getByText(lab, { exact: true }).first().locator('xpath=ancestor::*[.//input[@type="file"]][1]').locator('input[type=file]').first();
  const toast = async () => ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,50}(not allowed|not supported|too large|exceeds|larger than|maximum|only [a-z ,.]*allowed|invalid|must be|accepted)[^.]{0,60}/i) || [''])[0];
  let alerted = false; page.on('dialog', d => { alerted = true; d.dismiss().catch(() => { }); });
  for (const [lab, files] of [['QA MF file', ['qa-mf.txt', 'qa-mf.png', 'qa-mf-big.pdf', 'qa-mf.pdf']], ['QA MF img', ['qa-mf-xss.svg', 'qa-mf.pdf', 'qa-mf.png']]]) {
    const inp = inputFor(lab); const acc = await inp.getAttribute('accept').catch(() => null);
    for (const f of files) { await inp.setInputFiles(TD + f).catch(e => out.push('err ' + e.message.slice(0, 40))); await sleep(2500); out.push(`${lab} (accept=${acc}) ← ${f}: "${await toast()}", listed=${(await page.getByText(f).count()) > 0}`); }
  }
  const s = await shot('I38-uploads');
  await page.getByPlaceholder('Name').first().fill('QA MF upload rec 2'); await page.getByRole('button', { name: /^Save$/ }).last().click().catch(() => { }); await sleep(4000);
  const recs = arr((await api('GET', `/modules/${T.id}/records?page_size=100`)).j.data); const ur = recs.find(r => /upload rec 2/.test(JSON.stringify(r))); const g = ur ? await getRec(T.id, ur.id) : {};
  const mime = x => { const p = x && x.properties; return p ? (p.mime && p.mime.value) + ' ' + (p.name && p.name.value || '') : String(x && x.kind); };
  // API: the same wrong types straight to the record API
  const api1 = await mkRec(T.id, { name: 'QA MF upload api', qa_file: { url: 'x', mime: 'text/plain', name: 'qa-mf.txt', size: 22 } }, L);
  rec('I38', 'INFO', out.join(' ; ') + `; script alert fired=${alerted}; saved record → file=${mime(g.qa_file)}, image=${mime(g.qa_img)}; API record with a text/plain object in the pdf-only field → ${api1.s}`, { shot: s });
  await page.keyboard.press('Escape');
});
return done();
