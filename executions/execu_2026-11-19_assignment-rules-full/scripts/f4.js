const L = []; const iso = d => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
const watch = async (keys, sec) => { const seen = {}; const t0 = Date.now(); while (Date.now() - t0 < sec * 1000) { for (const k of keys) if (!seen[k]) { const o = await ownN(IDS[k]); if (o) seen[k] = o + '@' + Math.round((Date.now() - t0) / 1000) + 's'; } if (keys.every(k => seen[k])) break; await sleep(5000); } return seen; };
L.push(await prefsS(IDS.DA, { department_threshold_enabled: true, department_threshold: 1, agent_threshold_enabled: false, assign_backlogs: false }));
const due = { L1: 3, L2: 1, L3: 2 }; for (const k of ['L1', 'L2', 'L3']) { const t = await mkTicket('QA AR F07 ' + k + ' due+' + due[k], IDS.DA, { due_date: iso(due[k]) }); IDS['TK_' + k] = t.id; L.push(k + ' ' + t.s + (t.e || '') + ' due=' + (t.o && t.o.due_date)); await sleep(1500); }
saveIds(); await sleep(8000); L.push({ backlog: await Promise.all(['TK_F03', 'TK_L1', 'TK_L2', 'TK_L3'].map(async k => k + ':' + (await api('GET', '/desk/tickets/' + IDS[k])).j.data.in_backlog)) });
// limit 1, created_time, 2 free slots for A1
const a1 = await wlo(IDS.A1, IDS.DA);
L.push(await prefsS(IDS.DA, { agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: a1 + 2 }], assign_backlogs: true, backlog_limit: 1, backlog_order: 'created_time' }));
const t0 = new Date().toISOString().slice(11, 19); const s1 = await watch(['TK_F03', 'TK_L1', 'TK_L2', 'TK_L3'], 200);
L.push(R_('F-07a', Object.keys(s1).length >= 1 ? 'Pass' : 'Fail', 'Assign backlogs on (limit 1, order created time), A1 given 2 free slots at ' + t0 + ' UTC: assignments ' + JSON.stringify(s1) + ' (F03 is oldest; F06 older than L1-L3 too)'));
fs.writeFileSync(RUN + '/out/f4a.json', JSON.stringify(s1));
return L;
