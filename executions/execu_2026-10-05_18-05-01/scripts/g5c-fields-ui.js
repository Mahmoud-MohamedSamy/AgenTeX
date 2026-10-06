// Group 5c — builder UI checks: I5 required vs read-only, I25 regex tester + enforcement, I41 remove keeps data.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
const B = async () => { await go(`/settings/modules-and-fields/${MID}/layouts/${DEF.id}`, 10000); };
const fieldMenu = async label => {
  const c = page.getByText(label, { exact: true }); const n = await c.count(); let lab = null;
  for (let i = 0; i < n; i++) { const bb = await c.nth(i).boundingBox().catch(() => null); if (bb && bb.x > 340) { await c.nth(i).scrollIntoViewIfNeeded(); await c.nth(i).hover(); lab = await c.nth(i).boundingBox(); break; } }
  if (!lab) throw new Error('label not on canvas: ' + label); await sleep(600);
  const btns = page.locator('[title="Field options"], [aria-label="Field options"]'); const bn = await btns.count(); let best = null, bd = 1e9;
  for (let i = 0; i < bn; i++) { const bb = await btns.nth(i).boundingBox().catch(() => null); if (!bb) continue; const dy = Math.abs((bb.y + bb.height / 2) - (lab.y + lab.height / 2)); if (bb.x > lab.x && dy < 30 && bb.x - lab.x < 1100 && dy < bd) { bd = dy; best = btns.nth(i); } }
  if (!best) throw new Error('no field options for ' + label); await best.click(); await sleep(700);
};
const props = async tab => { await page.getByText('Edit Properties', { exact: true }).first().click(); await sleep(1500); if (tab) { await page.getByText(tab, { exact: true }).first().click(); await sleep(1000); } };
await step('I5', async () => {
  await B(); await fieldMenu('QA MF Required'); await props('PERMISSIONS');
  const t = await txt(); const hint = t.includes("A required field can't be read-only — remove Required first.");
  const sw = page.locator('aside, [role=dialog]').last().getByRole('switch').first(); const dis = (await sw.count()) ? await sw.isDisabled() : null;
  const s = await shot('I5-required-readonly');
  rec('I5', hint || dis ? 'PASS' : 'FAIL', `PERMISSIONS tab of a required field: hint "A required field can't be read-only — remove Required first." shown=${hint}; Read-only switch disabled=${dis}`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I25', async () => {
  await B(); await fieldMenu('QA MF Regex'); await props('VALIDATION');
  const rx = page.getByPlaceholder('e.g. ^[A-Z]{2}[0-9]{4}$'); const n = await rx.count();
  let out = [];
  if (n) {
    await rx.fill('(['); await sleep(400); out.push('invalid "([" → ' + ((await txt()).includes('Invalid regular expression') ? '"Invalid regular expression"' : 'no message'));
    await rx.fill('^[A-Z]{2}[0-9]{4}$'); const tester = page.getByPlaceholder('Test a value against the pattern…');
    if (await tester.count()) { await tester.fill('AB1234'); await sleep(300); out.push('tester AB1234 → ' + ((await txt()).includes('✓ Value matches the pattern') ? 'match' : '?')); await tester.fill('ab12'); await sleep(300); out.push('tester ab12 → ' + ((await txt()).includes('✗ Value does not match') ? 'no match' : '?')); }
    await page.locator('aside button, [role=dialog] button').filter({ hasText: /^Apply$/ }).last().click(); await sleep(800);
    await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4500);
    const lay = JSON.stringify((await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data); const stored = (lay.match(/"regex":"[^"]*"/) || ['none'])[0];
    const r = await api('POST', `/modules/${MID}/records`, { data: [{ field: 'name', value: { kind: 'string', value: 'QA MF rx' } }, { field: 'qa_req', value: { kind: 'string', value: 'v' } }, { field: 'qa_req_ro', value: { kind: 'string', value: 'v' } }, { field: 'qa_rx', value: { kind: 'string', value: 'ab12' } }], layout_id: DEF.id });
    out.push(`saved in layout ${stored}; API record with "ab12" → ${r.s} ${((r.j && r.j.error && r.j.error.code) || '')}`);
    rec('I25', /Invalid regular expression/.test(out[0]) && r.s >= 400 ? 'PASS' : 'FAIL', out.join(' ; '));
  } else rec('I25', 'BLOCKED', 'regex box not found on the VALIDATION tab');
});
await step('I41', async () => {
  const recs = arr((await api('GET', `/modules/${MID}/records?page_size=100`)).j.data); let rid = null;
  for (const r of recs) { const g = (await api('GET', `/modules/${MID}/records/${r.id}`)).j.data; if ((g.data || []).some(x => x.field === 'qa_sl10' && x.value && x.value.value)) { rid = r.id; break; } }
  const lay = (await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data; const body = JSON.parse(JSON.stringify(lay)); delete body.id;
  for (const v of Object.values(body.views)) for (const s of v.layout.sections) for (const c of s.columns) c.fields = c.fields.filter(f => f.fieldName !== 'qa_sl10');
  const p1 = await api('PUT', `/modules/${MID}/layouts/${DEF.id}`, body);
  const g1 = (await api('GET', `/modules/${MID}/records/${rid}`)).j.data; const kept = (g1.data || []).find(x => x.field === 'qa_sl10');
  const f = arr((await api('GET', `/modules/${MID}/fields`)).j.data).find(x => x.fieldName === 'qa_sl10');
  const back = JSON.parse(JSON.stringify(lay)); delete back.id; const p2 = await api('PUT', `/modules/${MID}/layouts/${DEF.id}`, back);
  rec('I41', p1.s < 300 && kept && f ? 'PASS' : 'FAIL', `remove qa_sl10 from the layout → ${p1.s}; record value kept=${!!kept} (${kept ? JSON.stringify(kept.value) : ''}); field still exists as unused (layouts ${f && JSON.stringify(f.layouts)}); put back → ${p2.s}`);
});
return done();
