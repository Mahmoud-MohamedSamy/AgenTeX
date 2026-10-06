// Group 3 re-run of the API-create rows with a unique moduleKey per case (UI derives the key from the plural name).
const TS = '/teamspaces/a641f1df-f2c6-450e-a881-857776dacf70/modules';
const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const mk = (pl, si, key, extra) => api('POST', TS, { moduleKey: key, labels: { en: pl }, description: 'QA MF', pluralForm: pl, singularForm: si, storageScope: 'organization', ...(extra || {}) });
const kill = async id => (await api('DELETE', `/modules/${id}?cascade=true`)).s;
const idOf = r => r.j && r.j.data && r.j.data.id;
const dialogs = []; page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => { }); });
await step('C3', async () => {
  const cases = [['D2 spaces', '   ', '   '], ['D3 one char', 'Q', 'Q'], ['D4 25', 'QA MF ' + 'x'.repeat(19), 'QA MF ' + 'y'.repeat(19)], ['D5 26', 'QA MF ' + 'x'.repeat(20), 'QA MF ' + 'y'.repeat(20)], ['long 120', 'QA MF ' + 'z'.repeat(114), 'QA MF ' + 'w'.repeat(114)], ['D6 trim', '  QA MF Trim  ', '  QA MF Trim1  '], ['D8 Arabic', 'QA MF أصول', 'QA MF أصل'], ['D10 emoji', 'QA MF 📦 Boxes', 'QA MF 📦 Box'], ['D11 html', 'QA MF <img src=x onerror=alert(1)>', 'QA MF <b>x</b>'], ['D14 zero-width', 'QA MF​ZW', 'QA MF​ZW1']];
  const out = []; let i = 0;
  for (const [n, pl, si] of cases) {
    i++; const r = await mk(pl, si, 'qa_mf_c3_' + i); const id = idOf(r); let stored = '';
    if (id) { const g = (await api('GET', `/modules/${id}`)).j.data; stored = JSON.stringify(g.pluralForm); }
    if (n === 'D11 html' && id) { await go('/settings/modules-and-fields', 5000); out.push(`[list renders <img> element: ${(await page.locator('img[src="x"]').count()) > 0}; alerts: ${dialogs.length}]`); }
    out.push(`${n}: ${r.s}${id ? ' stored ' + stored : ' ' + ((r.j && r.j.error && r.j.error.message) || '').slice(0, 60)}`);
    if (id) await kill(id);
  }
  const s = out.join(' ; ');
  const bad = /D2 spaces: 20[01]|D3 one char: 20[01]|renders <img> element: true|alerts: [1-9]/.test(s);
  rec('C3', bad ? 'FAIL' : 'PASS', s + ' (each created module deleted again)');
});
await step('C6', async () => {
  const out = [];
  for (const [n, pl, si] of [['same name', 'QA MF Devices', 'QA MF Device'], ['case variant', 'qa mf devices', 'qa mf device'], ['standard name', 'Tickets', 'Ticket']]) {
    const r = await mk(pl, si, slug(pl)); const id = idOf(r); if (id) await kill(id);
    out.push(`${n} (key ${slug(pl)}): ${r.s} ${id ? 'CREATED (deleted again)' : ((r.j && r.j.error && r.j.error.message) || '').slice(0, 70)}`);
  }
  const r2 = await mk('QA MF Devices', 'QA MF Device', 'qa_mf_other_key'); const id2 = idOf(r2); if (id2) await kill(id2);
  out.push(`same display name, different key: ${r2.s} ${id2 ? 'CREATED (deleted again)' : ((r2.j && r2.j.error && r2.j.error.message) || '').slice(0, 70)}`);
  rec('C6', out.some(o => /CREATED/.test(o)) ? 'FAIL' : 'PASS', out.join(' ; '));
});
await step('C7', async () => {
  const r = await mk('QA MF NoPerm', 'QA MF NoPerm1', 'qa_mf_noperm'); const id = idOf(r); let g = '';
  if (id) { const m = (await api('GET', `/modules/${id}`)).j.data; g = `recordVisibility=${m.recordVisibility}`; await kill(id); }
  rec('C7', 'INFO', `create with no profile list → ${r.s}; ${g} (deleted again). Who can open it is not judged (no clean agent account)`);
});
await step('F9', async () => {
  const r = await mk('QA MF Temp', 'QA MF Temp1', 'qa_mf_temp'); const id = idOf(r); if (!id) throw new Error('temp create ' + r.s + ' ' + r.t.slice(0, 150));
  const noName = await api('POST', `/modules/${id}/records`, { data: [] });
  const withName = await api('POST', `/modules/${id}/records`, { data: [{ field: 'name', value: { kind: 'string', value: 'QA MF rec 1' } }] });
  const rid = idOf(withName);
  rec('F9', noName.s >= 400 && rid ? 'PASS' : 'FAIL', `record without the required Name → ${noName.s} ${((noName.j && noName.j.error && noName.j.error.message) || '').slice(0, 80)}; with Name → ${withName.s}`);
  const d1 = await api('DELETE', `/modules/${id}?cascade=true`);
  rec('C12', d1.s >= 400 && /record/i.test(d1.t) ? 'PASS' : 'FAIL', `DELETE ?cascade=true on a module with 1 record → ${d1.s} ${((d1.j && d1.j.error && (d1.j.error.code + ' ' + d1.j.error.message)) || '').slice(0, 140)}`);
  const dr = await api('DELETE', `/modules/${id}/records/${rid}`);
  const d2 = await api('DELETE', `/modules/${id}?cascade=true`);
  const gone = !arr((await api('GET', '/modules')).j.data).some(m => m.id === id);
  const rb = await api('GET', '/audit/recycle-bin/items?page_size=100'); const left = (rb.t || '').includes('QA MF rec 1') || (rb.t || '').includes(rid);
  rec('C13', gone && !left ? 'PASS' : 'FAIL', `DELETE record → ${dr.s}; DELETE module → ${d2.s} ${d2.s >= 300 ? d2.t.slice(0, 160) : ''}; module gone=${gone}; deleted record still listed in Recycle Bin=${left} (recycle-bin GET ${rb.s}) (NDC-1637)`);
});
await step('C1b', async () => {
  const qa = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
  rec('C1b', 'INFO', `QA test module now: plural "${qa && qa.pluralForm}", apiName ${qa && qa.apiName}, description "${qa && qa.description}" — a new custom module gets apiName null until one is set by hand (Zoho generates cm_<plural>)`);
});
return done();
