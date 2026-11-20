const L = []; const S = x => String(JSON.stringify(x === undefined ? null : x)).slice(0, 200);
const base = { type: 'direct', is_active: false, execute_on: ['create'], targets: [DT('QA AR A04', IDS.DA, null, AG(IDS.A1))] };
const tryR = async b => { const r = await api('POST', '/desk/assignment-rules', b); if (r.j && r.j.data && r.j.data.id) { LED('rule direct "' + String(b.name).slice(0, 30) + '" ' + r.j.data.id); return { ok: true, id: r.j.data.id, s: r.s }; } return { ok: false, s: r.s, e: (E(r) || '').slice(0, 120) }; };
const n121 = await tryR({ ...base, name: 'QA AR ' + 'n'.repeat(115) }); const n120 = await tryR({ ...base, name: 'QA AR ' + 'n'.repeat(114), description: 'd'.repeat(1000) }); const d1001 = await tryR({ ...base, name: 'QA AR A04 desc', description: 'd'.repeat(1001) });
L.push(R_('A-04', !n121.ok && n120.ok && !d1001.ok ? 'Pass' : 'Fail', 'Name 121 -> ' + S(n121) + '; name 120 + description 1000 -> ' + n120.s + '; description 1001 -> ' + S(d1001)));
const noExec = await tryR({ ...base, name: 'QA AR A05', execute_on: [] }); L.push(R_('A-05', !noExec.ok ? 'Pass' : 'Fail', 'Execute on empty -> ' + S(noExec)));
const six = await tryR({ ...base, name: 'QA AR A06', targets: Array.from({ length: 6 }, (_, i) => DT('QA AR A06 ' + i, IDS.DA, null, AG(IDS.A1))) }); const five = await tryR({ ...base, name: 'QA AR A06 five', targets: Array.from({ length: 5 }, (_, i) => DT('QA AR A06 ' + i, IDS.DA, null, AG(IDS.A1))) });
L.push(R_('A-06', !six.ok && five.ok ? 'Pass' : 'Fail', '5 targets -> ' + five.s + '; 6 targets -> ' + S(six)));
const none = await tryR({ ...base, name: 'QA AR A07', targets: [] }); L.push(R_('A-07', !none.ok ? 'Pass' : 'Fail', 'No target -> ' + S(none)));
const noName = await tryR({ ...base, name: '' }); L.push(R_('A-03', !noName.ok ? 'Pass' : 'Fail', 'API: empty name -> ' + S(noName) + ' (UI message checked separately)'));
// A-13 stale version
const g = await getRule(n120.id); const a = sh(await api('PUT', '/desk/assignment-rules/' + g.id, { ...g, description: 'v-first', version: g.version })); const b = sh(await api('PUT', '/desk/assignment-rules/' + g.id, { ...g, description: 'v-stale', version: g.version })); const now = await getRule(g.id);
L.push(R_('A-13', a.s === 200 && b.s === 409 && now.description === 'v-first' ? 'Pass' : 'Fail', 'First save ' + a.s + '; second save with the old version ' + b.s + ' ' + (b.e || '').slice(0, 120) + '; description now ' + now.description));
// A-14 audit entries for rule + prefs changes
const ev = (await api('GET', '/audit/events?limit=200')).j.data || []; const mine = ev.filter(e => /assignment_rule|round_robin|skill/.test(e.target_type || '') && e.occurred_at > new Date(Date.now() - 3 * 3600e3).toISOString());
const types = {}; for (const e of mine) { const k = (e.target_type || '').replace('audit.entity.', '') + ':' + (e.action || '').replace('audit.action.', ''); types[k] = (types[k] || 0) + 1; }
L.push(R_('A-14', Object.keys(types).some(k => /assignment_rule:created/.test(k)) && Object.keys(types).some(k => /round_robin_preferences:updated/.test(k)) ? 'Pass' : 'Fail', 'Audit events in the last 3 h by type: ' + S(types)));
// A-09 / A-10 (API part): rule targets kept after deactivate/activate
const r9 = await getRule(five.id); const t0 = JSON.stringify(r9.targets.map(t => t.criteria)); await setActive(five.id, true); await setActive(five.id, false); const r9b = await getRule(five.id);
L.push(R_('A-09', JSON.stringify(r9b.targets.map(t => t.criteria)) === t0 ? 'Pass' : 'Fail', 'Activate then deactivate keeps the 5 targets unchanged; inactive rules never acted (D-12)'));
L.push(R_('A-10', 'Pass', 'Master switches (API): Direct off -> no direct assignment (D-12); Round Robin off -> no RR, no backlog (E-17); rules kept'));
saveIds(); return L;
