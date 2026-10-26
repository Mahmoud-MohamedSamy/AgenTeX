await new Promise(r => setTimeout(r, 60000));
const out = []; let page_ = 1;
for (let p = 1; p <= 3; p++) { const r = await call('GET', `/modules/${MODS.leads}/records?page=${p}&per_page=100&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
  for (const x of (r.j.data || [])) { const fn = ((x.data.find(e => e.field === 'first_name') || {}).value || {}).value || ''; if (/^QA W2 (WF|IM)/.test(fn)) { const d = ((x.data.find(e => e.field === 'description') || {}).value || {}).value; const tg = ((x.data.find(e => e.field === 'tags') || {}).value || {}).items; out.push({ id: x.id, fn, description: d || null, tags: tg ? tg.length : 0, src: x.source }); } } if (out.length >= 10) break; }
return out;
