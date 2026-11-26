// Find contacts on the +qae1 address (read), keep one with Help Center access.
const C = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const MADE = '../made.json';
const made = JSON.parse(fs.readFileSync(MADE, 'utf8'));
const mine = made.other.find(x => x.kind === 'contact');
const fv = v => !v ? v : v.kind === 'array' ? (v.items || []).map(fv) : v.value;
const hits = [];
for (let page = 1; page <= 40; page++) {
  const r = await api('GET', `/modules/${C}/records?page_size=100&page=${page}`);
  const rows = arr(r.j?.data);
  for (const x of rows) { const d = Object.fromEntries((x.data || []).map(f => [f.field, fv(f.value)])); if (/\+qae1@/i.test(String(d.email || ''))) hits.push({ id: x.id, name: d.last_name || d.full_name, created: x.createdAt || x.created_at }); }
  const tp = r.j?.meta?.total_pages; if (!rows.length || (tp && page >= tp)) break;
}
const portal = [];
for (const h of hits) { const p = await api('GET', `/desk/contacts/${h.id}/help-center-access`); portal.push({ id: h.id.slice(0, 8), mine: h.id === mine.id, name: h.name, access: p.s + ' ' + JSON.stringify(p.j?.data || p.j?.error || '').slice(0, 160) }); }
return { count: hits.length, portal };
