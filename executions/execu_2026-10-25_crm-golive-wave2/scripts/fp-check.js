await new Promise(r => setTimeout(r, 20000));
const out = [];
for (let p = 1; p <= 2; p++) { const r = await call('GET', `/modules/${MODS.leads}/records?page=${p}&per_page=100&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
  for (const x of (r.j.data || [])) { const v = k => ((x.data.find(e => e.field === k) || {}).value || {}).value; if (/^QA W2 FPI/.test(v('first_name') || '')) out.push({ id: x.id, fn: v('first_name'), company: v('company') || null, email: v('email') || null }); } }
const s = await call('GET', `/modules/${MODS.leads}/import/e05df087-ff93-47b8-aab7-6fe57dd39bd8`);
return { records: out, session: s.s + ' ' + s.t.slice(0, 400) };
