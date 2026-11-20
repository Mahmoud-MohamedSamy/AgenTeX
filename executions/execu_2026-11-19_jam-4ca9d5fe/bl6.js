const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', D = '19510fdc-91f3-4a7a-8888-153f1318b765';
const dept = (await api('GET', '/desk/departments/' + D)).j?.data; log({ dept: dept?.name });
const t = (await api('GET', '/modules/' + TK + '/records/a1532aaa-0014-40ff-9a1d-5478928aea87')).j?.data; const f = {}; for (const d of (t?.data || [])) f[d.field] = d.value?.value; log({ ticket: f.subject, n: f.ticket_number, owner: f.owner, status: f.status });
const rules = ((await api('GET', '/desk/assignment-rules?type=round_robin')).j?.data?.rules || []).filter(r => r.department_id === D).map(r => ({ name: r.name, active: r.is_active, upd: r.updated_at }));
log({ rulesInDept: rules });
for (const p of ['/audit/logs?limit=50&q=round', '/audit/logs?limit=50', '/audit/events?limit=50']) { const r = await api('GET', p); log({ p, s: r.s, hits: JSON.stringify(r.j).match(/round[_ -]robin[_ -]pref[^"]{0,80}/gi)?.slice(0, 5), sample: JSON.stringify(r.j).slice(0, 200) }); }
