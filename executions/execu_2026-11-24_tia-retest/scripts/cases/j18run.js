const all = ids(); const out = {};
const nb = (await api('GET', '/notifications/unread-count?category=general&apps=crm')).j?.data; out.notifBefore = nb;
const r = await ask('Create a lead with first name QA TIA J18, last name Lead, company QA J18 Co, Single Line Permission QA');
const a = (r.final?.pending_actions || [])[0]; out.card = a && { kind: a.kind, sideEffects: a.side_effects };
if (!a) return { ...out, text: (r.text || '').slice(0, 300) };
const c = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); out.confirm = c.s + ' ' + (c.j?.data?.status || c.j?.error?.code);
await sleep(15000);
const L = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA J18' }]))}`)).j?.data);
out.leads = L.map(x => x.id); all.j18lead = L[0]?.id; fs.writeFileSync(RUN + '/out/ids.json', JSON.stringify(all, null, 1));
if (L[0]) ledger('J-18: lead QA TIA J18 ' + L[0].id + ' created through a Tia card — delete after');
for (const p of [`/workflow/rules/${all.j18rule}/executions`, `/workflow/executions?ruleId=${all.j18rule}`, `/workflow/rules/${all.j18rule}/history`, `/workflow/execution-history?ruleId=${all.j18rule}`]) { const x = await api('GET', p); out[p.split('?')[0].split('/').slice(-1)[0] + '_' + x.s] = (x.t || '').slice(0, 500); if (x.s === 200) break; }
const T = arr((await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/records?page=1&per_page=5&filters=' + encodeURIComponent(JSON.stringify([{ field: 'subject', operator: 'starts_with', value: 'QA TIA J18' }])))).j?.data);
out.tasks = T.map(x => x.id); all.j18tasks = out.tasks; fs.writeFileSync(RUN + '/out/ids.json', JSON.stringify(all, null, 1));
out.notifAfter = (await api('GET', '/notifications/unread-count?category=general&apps=crm')).j?.data;
const n = arr((await api('GET', '/notifications?take=10')).j?.data).slice(0, 5).map(x => (x.title || x.header || '') + ' | ' + (x.body || x.message || '').slice(0, 80) + ' | ' + (x.created_at || x.createdAt || '').slice(11, 19)); out.recentNotifications = n;
return out;
