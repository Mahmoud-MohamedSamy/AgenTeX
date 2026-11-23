// Cleanup of run 2 (22–23 Nov): everything in the ledger after run 1's cleanup (16:42 UTC) + QA WF objects by name.
const out = {}; const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => l > '- 2026-11-22T16:45');
const ids = re => [...new Set(LG.filter(l => re.test(l)).map(l => (l.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/) || [])[1]).filter(Boolean))];
const del = async (path, list) => { let ok = 0, gone = 0, err = []; for (const id of list) { const d = await api('DELETE', path + id); if (d.s < 300) ok++; else if (d.s === 404) gone++; else err.push(id.slice(0, 8) + ' ' + d.s + ' ' + d.t.slice(0, 100)); } return { ok, gone, of: list.length, err: err.slice(0, 4) }; };
// 1 rules (by name, all pages)
const rules = (await allRules()).filter(r => /^QA WF /.test(r.name) || r.name.includes('<script>')); out.rules = await del('/workflow/rules/', rules.map(r => r.id));
// 2 tickets
const tix = ids(/ ticket "QA WF /); out.tickets = await del(`/modules/${T}/records/`, tix);
// 3 blueprint
const bps = ids(/blueprint "QA WF /); out.blueprint = [];
for (const b of bps) { let d = await api('DELETE', `/modules/${T}/blueprints/${b}`); if (d.s >= 300) { const p = await api('PATCH', `/modules/${T}/blueprints/${b}`, { isActive: false }); const p2 = p.s >= 300 ? await api('POST', `/modules/${T}/blueprints/${b}/deactivate`, {}) : p; d = await api('DELETE', `/modules/${T}/blueprints/${b}`); out.blueprint.push('deact ' + p.s + '/' + p2.s + ' del ' + d.s + ' ' + d.t.slice(0, 150)); } else out.blueprint.push('del ' + d.s); }
// 4 assignment rules, macro, team, skills, skill type, tags, contacts, created contacts, tasks
out.ar = await del('/desk/assignment-rules/', ids(/assignment rule "QA WF /));
out.macro = await del('/desk/macros/', ids(/macro "QA WF /));
out.skills = await del('/desk/skills/', ids(/ skill "QA WF /));
out.skillType = await del('/desk/skill-types/', ids(/skill type "QA WF /));
out.team = await del('/desk/teams/', ids(/team "QA WF /));
out.tags = {}; for (const t of ids(/tag "zz wf /)) { const d = await api('DELETE', '/desk/tags/' + t + '?confirm=true'); out.tags[t.slice(0, 8)] = d.s; }
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', TASKS = 'd120a6c2-2596-4254-968b-a1bcd3a000bf';
const byName = async (m, re) => { const o = []; for (let p = 1; p <= 10; p++) { const a = arr((await api('GET', `/modules/${m}/records?page=${p}&page_size=100`)).j?.data); o.push(...a.filter(r => re.test(JSON.stringify(r.data || [])))); if (a.length < 100) break; } return o.map(r => r.id); };
out.contacts = await del(`/modules/${CM}/records/`, [...new Set([...ids(/contact "QA WF /), ...(await byName(CM, /QA WF/))])]);
out.tasks = await del(`/modules/${TASKS}/records/`, await byName(TASKS, /QA WF/));
// 5 department left over? (deleted in run) and holiday (deleted)
out.deptLeft = arr((await api('GET', '/desk/departments')).j?.data).filter(d => /QA WF/.test(d.name)).map(d => d.id);
out.holidayLeft = arr((await api('GET', '/desk/holiday-lists')).j?.data).filter(h => /QA WF/.test(h.name)).length;
await sleep(8000);
// 6 Recycle Bin purge (QA WF / zz wf items)
let purged = 0; for (let pass = 0; pass < 30; pass++) { const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data); const qa = items.filter(i => /QA WF|zz wf|<script>/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!qa.length) break; for (let k = 0; k < qa.length; k += 50) { const d = await api('POST', '/audit/recycle-bin/delete', { ids: qa.slice(k, k + 50).map(i => i.id) }); if (d.s < 300) purged += Math.min(50, qa.length - k); else { out.binErr = d.s + ' ' + d.t.slice(0, 150); break; } } if (out.binErr) break; await sleep(3000); }
out.binPurged = purged;
// 7 verify + shared settings
out.verify = { qaRulesLeft: (await allRules()).filter(r => /^QA WF /.test(r.name)).length, activeRules: (await allRules()).filter(r => r.isActive).map(r => r.name),
  hours: ((await api('GET', '/desk/business-hours')).j?.data || {}).preset, happinessOn: ((await api('GET', '/desk/happiness/settings')).j?.data || {}).is_enabled,
  directSwitch: ((await api('GET', '/desk/assignment/notification-settings')).j?.data || {}).direct_rules_enabled,
  binLeft: arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label]))).length,
  teamsLeft: JSON.stringify((await api('GET', '/desk/teams')).j?.data || '').match(/QA WF/g)?.length || 0,
  skillsLeft: arr((await api('GET', '/desk/skills?department_id=' + DEPT2)).j?.data?.skills).filter(s => /QA WF/.test(s.name)).length,
  arLeft: [...arr((await api('GET', '/desk/assignment-rules?type=direct&department_id=' + DEPT2)).j?.data), ...arr((await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + DEPT2)).j?.data)].filter(r => /QA WF/.test(r.name)).length };
ledger('CLEANUP run2 ' + JSON.stringify(out).slice(0, 900));
fs.writeFileSync(RUN + '/out/cleanup2.json', JSON.stringify(out, null, 1));
return out;
