const mid = await modId(); const L = I.layout; const base = I.base; const isDesk = APP === 'desk'; const sfx = isDesk ? '-desk' : '';
const raw = (vals, extra = {}, lid = L) => api('POST', '/modules/' + mid + '/records', { data: Object.entries({ ...base, ...vals }).map(([k, v]) => ({ field: k, value: enc(v) })), layout_id: lid, ...extra });
const tm = async f => { const t0 = Date.now(); const r = await f(); return [r, Date.now() - t0]; };
for (const r of await rules(mid)) if (r.name === P + ' R1 text' && r.primaryField === 'qa_vr_note') await delRule(mid, r.id);
const r1 = (await rules(mid)).find(r => r.name === P + ' R1 text');
// K5 slow regex on the saved field
{ const x = await mkRule(mid, { name: P + ' K5 redos', layoutId: L, primaryField: 'qa_vr_note', branches: [B(C('regexMatches', 'qa_vr_note', '(a+)+$'), 'QA K5')] });
  let info = 'rule (a+)+$ -> ' + SR(x).slice(0, 100);
  if (x.s < 300) { for (const n of [30, 5000]) { const [r, ms] = await tm(() => raw({ qa_vr_note: 'a'.repeat(n) + '!' })); info += ` | ${n + 1}-char value -> ${r.s} in ${ms} ms`; }
    const [v, ms2] = await tm(() => api('POST', VR(mid) + '/verify', { field: 'qa_vr_note', data: { qa_vr_note: 'a'.repeat(5000) + '!' }, layoutId: L, recordId: null })); info += ` | verify -> ${v.s} in ${ms2} ms`;
    await delRule(mid, x.j.data.id); }
  const ms = [...info.matchAll(/in (\d+) ms/g)].map(m => +m[1]);
  RES('K5' + sfx, ms.length && Math.max(...ms) < 5000 ? 'PASS' : 'CHECK', info); }
if (!isDesk) {
  const w = await mkRule(mid, { name: P + ' E4 warn', layoutId: L, primaryField: 'qa_vr_note', mode: 'warn', branches: [B(C('eq', 'qa_vr_note', 'WARN'), 'QA E4 are you sure?')] });
  if (w.s < 300) { const wid = w.j.data.id; I.warnRule = wid; SAVE();
    const a = await raw({ qa_vr_note: 'WARN' }); const b = await raw({ qa_vr_note: 'WARN' }, { confirmed_warnings: [wid] }); const c = await raw({ qa_vr_note: 'WARN' }, { confirmed_warnings: [r1.id] }); const c2 = await raw({ qa_vr_note: 'WARN' }, { confirmed_warnings: ['00000000-0000-0000-0000-000000000000'] });
    if (b.j && b.j.data) { (I.recs = I.recs || []).push([mid, b.j.data.id]); SAVE(); }
    RES('E4', a.s >= 400 && E(a).includes('WARNING') && b.s < 300 ? 'PASS' : 'FAIL', `no confirm -> ${a.s} ${a.t.slice(0, 350)} | confirmed -> ${b.s}`);
    RES('E5', c.s >= 400 && c2.s >= 400 ? 'PASS' : 'FAIL', `confirm with other rule id -> ${SR(c).slice(0, 120)} | random id -> ${SR(c2).slice(0, 120)}`);
    const h8 = await raw({ qa_vr_note: 'WARN', qa_vr_text: 'BAD-h8' }); const h8b = await raw({ qa_vr_note: 'WARN', qa_vr_text: 'BAD-h8' }, { confirmed_warnings: [wid] });
    RES('H8-api', h8.s === 422 && h8b.s === 422 ? 'PASS' : 'CHECK', `warn+block -> ${SR(h8).slice(0, 350)} | with warn confirmed -> ${SR(h8b).slice(0, 200)}`);
    const ok = await mkRec(mid, { ...base, qa_vr_note: 'fine' }, L); const u1 = await updRec(mid, ok.id, { qa_vr_note: 'WARN' }); const u2 = await updRec(mid, ok.id, { qa_vr_note: 'WARN' }, { confirmed_warnings: [wid] });
    RES('E3', u1.s >= 400 && u2.s < 300 ? 'PASS' : 'FAIL', `API part: edit to WARN -> ${SR(u1.r).slice(0, 150)} | with confirm -> ${u2.s}`);
    // mass update path with warn
    const mu = await api('POST', '/modules/' + mid + '/records/mass-update', { record_ids: [ok.id], data: [{ field: 'qa_vr_text', value: enc('BAD-mass') }] });
    RES('G9-api', 'INFO', 'mass update of a rule field to a bad value -> ' + SR(mu).slice(0, 300) + ' ' + mu.t.slice(0, 300));
    I.massRec = ok.id; SAVE();
  } else RES('E4', 'FAIL', 'warn rule refused ' + SR(w));
  // K7/F4 with functionSecret
  const f = await mkRule(mid, { name: P + ' F4 secret', layoutId: L, primaryField: 'qa_vr_email', kind: 'function', branches: [], function: { url: 'https://qa-vr1112.invalid/hook', timeoutMs: 3000 }, functionSecret: 'QaSecretValue12345' });
  if (f.s < 300) { const fid = f.j.data.id; const g = await getRule(mid, fid); const lst = await api('GET', VR(mid));
    RES('K7', !g.t.includes('QaSecretValue12345') && !lst.t.includes('QaSecretValue12345') && g.j.data.function.hasSecret ? 'PASS' : 'FAIL', `secret saved (hasSecret=${g.j.data.function.hasSecret}); secret text in GET one: ${g.t.includes('QaSecretValue12345')}, in list: ${lst.t.includes('QaSecretValue12345')}`);
    const p = await putRule(mid, fid, { ...g.j.data, description: 'F4 put without secret' }); const after1 = (await getRule(mid, fid)).j.data;
    const p2 = await putRule(mid, fid, { ...after1, functionSecret: '' }); const after2 = (await getRule(mid, fid)).j.data;
    RES('F4', g.j.data.function.hasSecret && after1.function.hasSecret && !after2.function.hasSecret ? 'PASS' : 'FAIL', `create with secret -> hasSecret ${g.j.data.function.hasSecret}; PUT without functionSecret (${p.s}) -> kept ${after1.function.hasSecret}; PUT functionSecret '' (${p2.s}) -> cleared ${!after2.function.hasSecret}`);
    await delRule(mid, fid); } else RES('K7', 'FAIL', 'create ' + SR(f));
}
return 'done';
