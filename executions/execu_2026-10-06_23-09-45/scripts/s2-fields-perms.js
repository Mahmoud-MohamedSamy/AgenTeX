// Owner: QA fields on QA MF Open, owner records, per-profile permissions for Desk Agent through the builder PERMISSIONS tab.
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const fields = async () => arr((await api('GET', `/modules/${OPEN}/fields`)).j.data);
const have0 = new Set((await fields()).map(f => f.fieldName)); const r1 = await api('POST', `/modules/${OPEN}/fields`, { fields: ['qa_secret', 'qa_ro', 'qa_vis'].filter(n => !have0.has(n)).map(n => ({ fieldName: n, labels: { en: 'QA MF ' + n.slice(3) }, datatypeKey: 'single_line', required: false, unique: false, uniquePeerModuleIds: [] })) });
const DEF = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data).find(x => x.isDefault);
const lay = (await api('GET', `/modules/${OPEN}/layouts/${DEF.id}`)).j.data; const qa = (await fields()).filter(f => /^qa_/.test(f.fieldName));
const viewInfo = Object.entries(lay.views || {}).map(([k, v]) => k + ':' + (v && v.layout && v.layout.sections ? v.layout.sections.length : 'null')).join(',');
for (const v of ['CREATE', 'DETAIL', 'QUICK_CREATE']) { if (!(lay.views[v] && lay.views[v].layout && lay.views[v].layout.sections && lay.views[v].layout.sections[0])) continue; const sec = lay.views[v].layout.sections[0]; const col = sec.columns[sec.columns.length - 1]; const have = new Set(sec.columns.flatMap(c => c.fields.map(f => f.id))); for (const f of qa) if (!have.has(f.id)) col.fields.push(f); }
const b = { ...lay }; delete b.id; const r2 = await api('PUT', `/modules/${OPEN}/layouts/${DEF.id}`, b);
const enc = v => ({ kind: 'string', value: v });
const recs = []; for (const n of ['QA MF owner rec 1', 'QA MF owner rec 2']) { const r = await api('POST', `/modules/${OPEN}/records`, { data: [{ field: 'name', value: enc(n) }, { field: 'qa_secret', value: enc('TOP-SECRET-123') }, { field: 'qa_ro', value: enc('read only value') }], layout_id: DEF.id }); recs.push(r.j && r.j.data && r.j.data.id); }
// builder PERMISSIONS tab
const cap = []; const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && /field-permissions|permissions/.test(r.url())) cap.push(`${r.method()} ${r.url().replace(API, '')} ${(r.postData() || '').slice(0, 300)}`); };
page.on('request', onW);
const setPerm = async (label, col) => {
  await go(`/settings/modules-and-fields/${OPEN}/layouts/${DEF.id}`, 10000);
  const c = page.getByText(label, { exact: true }); let lab = null; for (let i = 0; i < await c.count(); i++) { const bb = await c.nth(i).boundingBox(); if (bb && bb.x > 340) { await c.nth(i).scrollIntoViewIfNeeded(); await c.nth(i).hover(); lab = await c.nth(i).boundingBox(); break; } }
  await sleep(500); const btns = page.locator('[title="Field options"]'); let best = null, bd = 1e9; for (let i = 0; i < await btns.count(); i++) { const bb = await btns.nth(i).boundingBox(); if (!bb) continue; const dy = Math.abs(bb.y - lab.y); if (bb.x > lab.x && dy < 30 && dy < bd) { bd = dy; best = btns.nth(i); } }
  await best.click(); await sleep(600); await page.getByText('Edit Properties', { exact: true }).first().click(); await sleep(1200);
  await page.getByText('PERMISSIONS', { exact: true }).first().click(); await sleep(1500);
  const row = page.locator('tr', { hasText: 'Desk Agent' }).filter({ hasNotText: 'Light' }).first();
  const boxes = row.locator('input[type=checkbox]'); const n = await boxes.count();
  const target = col === 'read' ? boxes.nth(0) : boxes.nth(n - 1); await target.click(); await sleep(1500);
  const state = await boxes.evaluateAll(bs => bs.map(x => x.checked));
  await page.keyboard.press('Escape'); await sleep(500);
  return `${label}: Desk Agent checkboxes now ${JSON.stringify(state)}`;
};
const p1 = await setPerm('QA MF secret', 'read');
const p2 = await setPerm('QA MF ro', 'edit');
page.off('request', onW);
const fp = await api('GET', `/modules/${OPEN}/field-permissions`);
rec('S2', 'INFO', `views before save: ${viewInfo}; fields → ${r1.s}; layout → ${r2.s}; owner records ${recs.join(', ')}; ${p1}; ${p2}; field-permissions GET ${fp.s} ${fp.t.slice(0, 300)}`, { writes: cap, recs });
return done();
