// Poll (read-only) for tickets created after the start time that are not our QA WF tickets.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const since = new Date(Date.now() - 20 * 60e3).toISOString();
const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.value;
const seen = [];
for (let i = 0; i < 6; i++) {
  const r = await api('GET', `/modules/${T}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`);
  for (const rec of arr(r.j?.data)) { const o = {}; for (const x of rec.data || []) o[x.field] = val(x.value); const at = rec.created_at || rec.createdAt || o.created_at || '';
    if (!/^QA WF /.test(o.subject || '') && (!at || at > since) && !seen.find(s => s.id === rec.id)) seen.push({ id: rec.id, subject: o.subject, channel: o.channel, email: o.email, dept: o.department, number: o.ticket_number, at }); }
  if (seen.filter(s => s.at && s.at > since).length) break;
  await sleep(20000);
}
return { since, found: seen.filter(s => !s.at || s.at > since).slice(0, 5) };
