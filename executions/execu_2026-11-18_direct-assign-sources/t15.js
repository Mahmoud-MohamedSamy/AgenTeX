const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const NM = { '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner (rule target)' };
const L = arr((await api('GET', '/modules/' + T + '/records?limit=40')).j).filter(x => x.created_at > '2026-11-18T13:00');
const rows = []; for (const x of L) { const g = await api('GET', '/modules/' + T + '/records/' + x.id); const o = {}; for (const f of (g.j?.data?.data || [])) o[f.field] = f.value?.value; rows.push({ id: x.id, n: o.ticket_number, subj: (o.subject || '').slice(0, 50), owner: NM[o.owner] || o.owner || null, channel: o.channel, dept: (o.department || '').slice(0, 8), src: x.source, at: x.created_at.slice(11, 19) }); }
log(rows.filter(r => /QA RT22|email/i.test(r.subj + r.channel + r.src)));
log({ allSince1300: rows.length, emailAny: rows.filter(r => /email/i.test(String(r.channel) + r.src)).length });
fs.writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/tavi-rows3.json', JSON.stringify(rows, null, 1));
