const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const all = (await api('GET', '/desk/assignment-rules?type=round_robin')).j?.data?.rules || [];
const rules = all.filter(x => /QA BL/i.test(x.name || '') || /QA BL/i.test(JSON.stringify(x.targets || '')));
log({ rules: rules.map(x => ({ id: x.id, name: x.name, dept: x.department_id, active: x.is_active, cond: JSON.stringify(x.targets?.[0]?.criteria), pool: x.targets?.[0]?.pool?.user_ids })) });
const tks = []; let tp = 1; for (let i = 1; i <= tp && i <= 15; i++) { const r = await api('GET', '/modules/' + TK + '/records?page_size=100&page=' + i); tp = r.j?.meta?.total_pages || tp; for (const x of arr(r.j)) { const f = {}; for (const d of (x.data || [])) f[d.field] = d.value?.value; if (/^QA BL/i.test(f.subject || '')) tks.push({ id: x.id, n: f.ticket_number, subj: f.subject, dept: f.department, owner: f.owner, status: f.status, created: x.created_at }); } }
log({ tickets: tks });
const ds = new Set([...rules.map(r => r.department_id), ...tks.map(t => t.dept)]);
for (const d of ds) log({ dept: d, prefs: (await api('GET', '/desk/departments/' + d + '/round-robin-preferences')).j?.data });
