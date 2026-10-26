await new Promise(r => setTimeout(r, 10000));
const out = [];
for (let p = 1; p <= 3; p++) { const r = await call('GET', `/modules/${MODS.tasks}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`);
  for (const x of (r.j.data || [])) { const v = k => ((x.data.find(e => e.field === k) || {}).value || {}).value; if (/QA W2 AC/.test(v('subject') || v('name') || '')) out.push({ id: x.id, subject: v('subject'), due: v('due_date'), repeat: v('repeat') }); } if (!r.j.meta || !r.j.meta.more_records) break; }
const m = await call('GET', `/modules/${MODS.meetings}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`);
const meets = (m.j.data || []).filter(x => /QA W2 AC/.test(JSON.stringify(x))).map(x => x.id);
return { tasks: out, meetings: meets };
