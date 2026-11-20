const L = [];
const rr = await mkRR('QA AR F seq', IDS.DA, SW('QA AR F'), 'sequential', [IDS.A1, IDS.A2, IDS.A3]); IDS.RR_F = rr.id; saveIds(); L.push('rule ' + rr.s + ' ' + (rr.e || ''));
L.push(await prefsS(IDS.DA, { assign_to_offline_agents: false }));
L.push(await pres([IDS.A1, IDS.A2, IDS.A3]));
const a = []; for (let i = 1; i <= 4; i++) { const t = await mkTicket('QA AR F01 off ' + i, IDS.DA); await sleep(4000); a.push({ t: t.id, o: await waitO(t.id, 30) }); }
L.push({ offlineOff: a.map(x => x.o.owner) });
const h = await hist(a[0].t); L.push({ hist0: h });
L.push(R_('F-01a', a.every(x => x.o.owner === 'A1' || x.o.owner === 'A2') ? 'Pass' : 'Fail', 'Offline agents OFF, pool A1,A2,A3 (A3 offline): 4 tickets went to ' + a.map(x => x.o.owner).join(', ') + '. History of first: ' + JSON.stringify(h).slice(0, 300)));
L.push(await prefsS(IDS.DA, { assign_to_offline_agents: true }));
const b = []; for (let i = 1; i <= 3; i++) { const t = await mkTicket('QA AR F01 on ' + i, IDS.DA); await sleep(4000); b.push({ t: t.id, o: await waitO(t.id, 30) }); }
L.push({ offlineOn: b.map(x => x.o.owner) });
L.push(R_('F-01b', b.some(x => x.o.owner === 'A3') ? 'Pass' : 'Fail', 'Offline agents ON: 3 tickets went to ' + b.map(x => x.o.owner).join(', ') + ' (A3 offline should now get its turn)'));
await prefsS(IDS.DA, { assign_to_offline_agents: false });
const w = {}; for (const k of ['A1', 'A2']) { const x = (await api('GET', '/desk/agents/' + IDS[k] + '/workload')).j.data.departments; w[k] = { DA: (x.find(d => d.department_id === IDS.DA) || {}).open_tickets || 0, total: x.reduce((s, d) => s + (d.open_tickets || 0), 0) }; }
L.push({ w });
L.push(await prefsS(IDS.DA, { agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: w.A1.DA + 1 }, { user_id: IDS.A2, threshold: w.A2.DA + 1 }] }));
const t = await mkTicket('QA AR F14 count', IDS.DA); const o = await waitO(t.id, 30); const d = (await api('GET', '/desk/tickets/' + t.id)).j.data;
L.push(R_('F-14', o.owner ? 'Pass' : 'Fail', 'Agent thresholds = Dept A open + 1 (A1 ' + (w.A1.DA + 1) + ' vs total ' + w.A1.total + ', A2 ' + (w.A2.DA + 1) + ' vs total ' + w.A2.total + '): ticket ' + (o.owner ? 'assigned to ' + o.owner + ' → threshold counts this department only (NDC-2824 fixed)' : 'went to backlog (in_backlog ' + d.in_backlog + ') → threshold counts every department (NDC-2824 still fails)')));
await prefsS(IDS.DA, { agent_threshold_enabled: false, agent_thresholds: [] });
return L;
