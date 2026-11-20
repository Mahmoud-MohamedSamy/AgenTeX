const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/'; const o = JSON.parse(fs.readFileSync(OUT + 's1.json', 'utf8'));
const sv = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) }; const fields = x => Object.entries(x).map(([k, v]) => ({ field: k, value: sv(v) }));
const st = async id => { const d = (await api('GET', '/modules/' + TK + '/records/' + id)).j?.data?.data || []; const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; const ow = (d.find(f => f.field === 'owner') || {}).value?.value || null; return { owner: ow === TU1 ? 'TU1' : ow, in_backlog: t.in_backlog }; };
o.back2 = (await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA JAM2 backlog 2', description: 'QA JAM2 retest', department: DB, status: 'Open', priority: 'medium', owner: null }) })).j?.data?.id;
await sleep(15000); log({ back2: await st(o.back2) });
const p = await api('PATCH', '/modules/' + TK + '/records/' + o.back, { data: [{ field: 'status', value: { kind: 'string', value: 'Closed' } }] }); log({ adminClosesTU1Ticket: p.s, at: new Date().toISOString().slice(11, 19) });
const res = []; for (let i = 0; i < 9; i++) { await sleep(10000); const s = await st(o.back2); res.push(new Date().toISOString().slice(11, 19) + ' owner=' + s.owner + ' in_backlog=' + s.in_backlog); if (s.owner) break; } log(res);
fs.writeFileSync(OUT + 's1.json', JSON.stringify(o, null, 1));
