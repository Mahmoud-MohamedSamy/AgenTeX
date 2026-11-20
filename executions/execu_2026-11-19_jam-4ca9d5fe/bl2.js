const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_jam-4ca9d5fe/out/'; const o = JSON.parse(fs.readFileSync(OUT + 'bl.json', 'utf8'));
const pres = async () => { const p = (await api('POST', '/desk/agents/presence/query', { user_ids: [TU1] })).j?.data?.agents?.[0]?.presence; return p?.online; };
const P = JSON.parse(process.env.P); const prefs = { ...o.base, ...P };
const put = await api('PUT', '/desk/departments/' + DB + '/round-robin-preferences', prefs); log({ case: process.env.CASE, put: put.s, prefs: P, online: await pres(), at: new Date().toISOString().slice(11, 19) });
const W = process.env.W; const res = []; for (let i = 0; i < 12; i++) { await sleep(10000); const d = (await api('GET', '/modules/' + TK + '/records/' + o[W])).j?.data?.data || []; const ow = (d.find(f => f.field === 'owner') || {}).value?.value || null; res.push(new Date().toISOString().slice(11, 19) + ' ' + W + ' owner=' + (ow === TU1 ? 'TU1' : ow)); if (ow) break; }
log(res); o.base = prefs; fs.writeFileSync(OUT + 'bl.json', JSON.stringify(o, null, 1));
