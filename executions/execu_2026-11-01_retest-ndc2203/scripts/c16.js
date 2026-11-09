page.on('dialog', d => d.accept().catch(() => {}));
const since = new Date(Date.now() - 5 * 60e3).toISOString(); const seen = [];
for (let i = 0; i < 20; i++) {
  const r = await api('GET', `/modules/${T}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`);
  for (const rec of arr(r.j?.data)) { const o = {}; for (const x of rec.data || []) o[x.field] = val(x.value); if (/^QA WF /.test(o.subject || '') || seen.find(s => s.id === rec.id)) continue; seen.push({ id: rec.id, subject: o.subject, channel: o.channel, email: o.email, number: o.ticket_number, created: o.created_at }); }
  if (seen.length) break; await sleep(20000);
}
return fin({ since, seen: seen.slice(0, 5) });
