// Finds every live record whose name/first_name/subject/title/deal_name starts with "QA W2" in the 15 modules (all layouts).
const out = {};
for (const [k, id] of Object.entries(MODS)) {
  const found = [];
  for (let p = 1; p <= 120; p++) {
    const r = await call('GET', `/modules/${id}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`);
    if (r.s !== 200) { found.push('ERR ' + r.s); break; }
    for (const x of (r.j.data || [])) { const vals = (x.data || []).filter(e => ['name', 'first_name', 'subject', 'title', 'deal_name', 'account_name', 'subscription_name'].includes(e.field)).map(e => String((e.value || {}).value || '')); if (vals.some(v => v.startsWith('QA W2'))) found.push(x.id + ' ' + vals.find(v => v.startsWith('QA W2'))); }
    const created = (r.j.data || []).map(x => x.created_at).filter(Boolean).sort()[0];
    if (!r.j.meta || !r.j.meta.more_records || (created && created < '2026-10-25T20:00')) break;
  }
  out[k] = found;
}
return out;
