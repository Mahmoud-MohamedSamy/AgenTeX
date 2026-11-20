const L = []; const D = IDS.DB;
const w1 = await wlo(IDS.A1, D), w2 = await wlo(IDS.A2, D);
L.push(await prefsS(D, { assign_to_offline_agents: false, department_threshold_enabled: false, agent_threshold_enabled: true, agent_thresholds: [{ user_id: IDS.A1, threshold: w1 + 5 }, { user_id: IDS.A2, threshold: w2 + 5 }], assign_backlogs: false, assign_on_closure: false, incoming_mode: 'immediate' }));
L.push({ before: { A1: w1, A2: w2 } });
const t0 = Date.now(); const made = await Promise.all(Array.from({ length: 20 }, (_, i) => api('POST', '/modules/' + T + '/records', body({ subject: 'QA AR FB burst ' + (i + 1), department: D, status: 'Open', priority: 'Medium' })).then(r => ({ id: r.j && r.j.data && r.j.data.id, s: r.s, at: Date.now() }))));
for (const m of made) if (m.id) LED('ticket "QA AR FB burst" ' + m.id);
await sleep(20000);
const res = []; for (const m of made) { const own = await ownN(m.id); const h = (await hist(m.id)); const n = Array.isArray(h) ? h.filter(x => /auto_assigned/.test(x)).length : -1; res.push({ own, n }); }
const cnt = { A1: res.filter(x => x.own === 'A1').length, A2: res.filter(x => x.own === 'A2').length, none: res.filter(x => !x.own).length, double: res.filter(x => x.n > 1).length, created: made.filter(m => m.id).length };
const after = { A1: await wlo(IDS.A1, D), A2: await wlo(IDS.A2, D) };
L.push(R_('I-03', cnt.A1 === 5 && cnt.A2 === 5 && cnt.none === 10 && cnt.double === 0 ? 'Pass' : 'Fail', '20 tickets at once, pool A1+A2, each with 5 free slots: A1 ' + cnt.A1 + ', A2 ' + cnt.A2 + ', unassigned ' + cnt.none + ', tickets with >1 assignment ' + cnt.double + ' (created ' + cnt.created + '); open after A1 ' + after.A1 + '/' + (w1 + 5) + ', A2 ' + after.A2 + '/' + (w2 + 5)));
// I-04 timing: 10 single tickets with room
await prefsS(D, { agent_thresholds: [{ user_id: IDS.A1, threshold: 150 }, { user_id: IDS.A2, threshold: 150 }] });
const times = []; for (let i = 1; i <= 10; i++) { const s0 = Date.now(); const r = await api('POST', '/modules/' + T + '/records', body({ subject: 'QA AR FB timing ' + i, department: D, status: 'Open', priority: 'Medium' })); const id = r.j && r.j.data && r.j.data.id; if (id) LED('ticket "QA AR FB timing" ' + id); let ms = null; for (let k = 0; k < 40; k++) { if (await ownN(id)) { ms = Date.now() - s0; break; } await sleep(250); } times.push(ms); }
const ok = times.filter(x => x !== null && x <= 5000).length; times.sort((a, b) => (a || 99999) - (b || 99999));
L.push(R_('I-04', ok >= 9 ? 'Pass' : 'Fail', 'Create -> owner (API poll every 250 ms), 10 tickets: ' + times.map(x => x === null ? '>10s' : (x / 1000).toFixed(1) + 's').join(', ') + '; within 5 s: ' + ok + '/10'));
return L;
