const cs = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const list = async (extra) => { const f = [{ field: 'department', operator: 'equals', value: cs }, ...extra]; const r = await api('GET', '/modules/' + TM + '/records?page=1&per_page=100&filters=' + encodeURIComponent(JSON.stringify(f))); return arr(D(r.j)).map(x => { const o = {}; for (const d of x.data) o[d.field] = d.value && d.value.value; return o; }); };
const open = await list([{ field: 'status', operator: 'equals', value: 'Open' }]); out.open = open.length; out.openSpam = open.filter(o => o.is_spam === true || o.is_spam === 'true').map(o => o.ticket_number); out.openArch = open.filter(o => o.is_archived === true || o.is_archived === 'true').map(o => o.ticket_number);
const all = await list([]); const by = {}; for (const o of all) by[o.status] = (by[o.status] || 0) + 1; out.by = by; out.allN = all.length;
out.spamAny = all.filter(o => String(o.is_spam) === 'true').map(o => o.ticket_number + ':' + o.status); out.archAny = all.filter(o => String(o.is_archived) === 'true').map(o => o.ticket_number + ':' + o.status);
out.onhold = all.filter(o => !['Open', 'Closed'].includes(o.status)).map(o => o.ticket_number + ':' + o.status);
await go('/analytics/dashboards/standard/overview', 12000); out.ov = (await mtxt()).match(/Open Tickets Now \d+/)?.[0];
return fin({ out });
