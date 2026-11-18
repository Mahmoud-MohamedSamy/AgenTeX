const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const NM = { '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner (rule target)' };
await sleep(15000);
const L = arr((await api('GET', '/modules/' + T + '/records?limit=30')).j).filter(x => x.created_at > '2026-11-18T12:40');
const rows = []; for (const x of L) { const g = await api('GET', '/modules/' + T + '/records/' + x.id); const o = {}; for (const f of (g.j?.data?.data || [])) o[f.field] = f.value?.value; if (/QA RT22/.test(o.subject || '')) rows.push({ id: x.id, n: o.ticket_number, subj: o.subject, owner: NM[o.owner] || o.owner || null, channel: o.channel, src: x.source, at: x.created_at.slice(11, 19) }); }
log(rows); fs.writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/tavi-rows2.json', JSON.stringify(rows, null, 1));
