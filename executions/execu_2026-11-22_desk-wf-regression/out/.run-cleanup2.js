// Shared helpers, prepended to every case script by run.sh. Every QA rule carries the guard
// "subject starts with 'QA WF <tag> '" unless a case says noGuard (those run only on QA departments).
const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-22_desk-wf-regression';
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const STD_LAYOUT = '1b55c25d-eb27-4046-afd1-b292398b435b';
const DEPT = 'bc53682c-7271-4fe0-8c32-99eff3a10bb1';      // QA RT19 WF Dept (main)
const DEPT2 = '4853562a-0b4d-45cb-ba34-9f2118fcd32c';     // QA AO Dept B (second)
const QA_EMAIL = 'mahmoud.mmohamedsamy+qawf@gmail.com';
const LEDGER = RUN + '/ledger.md';
const RES = RUN + '/out/results.jsonl';
const stamp = () => new Date().toISOString().slice(0, 19);
const ledger = line => fs.appendFileSync(LEDGER, `- ${stamp()} ${line}\n`);
const result = (id, verdict, note, extra) => { fs.appendFileSync(RES, JSON.stringify({ id, verdict, note, at: stamp(), ...(extra || {}) }) + '\n'); log(id, verdict, note); };

const S = v => ({ kind: 'string', stringValue: String(v) });
const I = v => ({ kind: 'int', intValue: v });
const B = v => ({ kind: 'bool', boolValue: v });
const TS = v => ({ kind: 'timestamp', timestampValue: v });
const L = (...v) => ({ kind: 'list', listValue: v.map(x => typeof x === 'object' ? x : S(x)) });
const guard = p => ({ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const AND = (...ops) => ({ kind: 'Logical', operator: 'And', operands: ops });
const OR = (...ops) => ({ kind: 'Logical', operator: 'Or', operands: ops });
const NOT = op => ({ kind: 'Logical', operator: 'Not', operands: [op] });
const cmp = (field, operator, value) => ({ kind: 'Comparison', field, operator, value });
const sm = (field, operator, v, ci) => ({ kind: 'StringMatch', field, operator, stringValue: v, caseInsensitive: !!ci });
const mem = (field, operator, values) => ({ kind: 'Membership', field, operator, values: values.map(x => typeof x === 'object' ? x : S(x)) });
const ex = (field, operator) => ({ kind: 'Existence', field, operator });
const changed = field => ({ kind: 'Changed', field });

// record values: kind MUST be the first key (old bug B-1)
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const dec = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(dec) : v.kind === 'object' ? v.properties : v.value;

const errOf = r => r.s >= 300 ? ((r.j && r.j.error && (r.j.error.message + ' ' + JSON.stringify(r.j.error.details || ''))) || r.t).slice(0, 400) : undefined;
async function mkRule(tag, trigger, actions, o = {}) {
  const crit = o.noGuard ? (o.criteria || null) : (o.criteria ? AND(guard(`QA WF ${tag} `), o.criteria) : guard(`QA WF ${tag} `));
  const body = { moduleId: T, name: `QA WF ${tag}`, isActive: o.active !== false, mode: o.mode || 'Recurring', trigger, criteria: crit,
    actions: actions.map((a, i) => ({ order: i, delaySeconds: 0, ...a })), departmentIds: o.departmentIds || [DEPT, DEPT2], ...(o.layoutId ? { layoutId: o.layoutId } : {}), ...(o.extra || {}) };
  const r = await api('POST', '/workflow/rules', body);
  const id = r.j && r.j.data && r.j.data.id;
  if (id) ledger(`rule "QA WF ${tag}" ${id}`);
  return { s: r.s, id, err: errOf(r), body };
}
async function mkTicket(tag, vals = {}, suffix = 'ticket') {
  const v = { subject: `QA WF ${tag} ${suffix}`.trim(), status: 'Open', department: DEPT, email: QA_EMAIL, channel: 'web', priority: 'medium', ...vals };
  const r = await api('POST', `/modules/${T}/records`, { data: Object.entries(v).filter(([k, x]) => x !== undefined && k !== '_layout').map(([field, x]) => ({ field, value: enc(x) })), layout_id: vals._layout || STD_LAYOUT });
  const id = r.j && r.j.data && r.j.data.id;
  if (id) ledger(`ticket "${v.subject}" ${id}`);
  return { s: r.s, id, err: errOf(r) };
}
const patchTicket = async (id, vals) => { const r = await api('PATCH', `/modules/${T}/records/${id}`, { data: Object.entries(vals).map(([field, x]) => ({ field, value: enc(x) })) }); return { s: r.s, err: errOf(r) }; };
const getTicket = async id => { const r = await api('GET', `/modules/${T}/records/${id}`); const o = {}; for (const x of ((r.j && r.j.data && r.j.data.data) || [])) o[x.field] = dec(x.value); o._s = r.s; return o; };
const execs = async (recordId, ruleId) => arr((await api("GET", `/workflow/executions?${ruleId ? "ruleId=" + ruleId : "recordId=" + recordId}&take=100`)).j?.data).filter(e => e.recordId === recordId); // ?recordId= alone returns [] (finding OB-03)
async function waitFor(fn, sec = 40, every = 2500) { const end = Date.now() + sec * 1000; let last; while (Date.now() < end) { last = await fn(); if (last) return last; await sleep(every); } return null; }
const waitTicket = (id, pred, sec) => waitFor(async () => { const t = await getTicket(id); return pred(t) ? t : null; }, sec);
const waitExec = (id, ruleId, sec) => waitFor(async () => { const e = await execs(id, ruleId); return e.length ? e : null; }, sec);
// quiet wait: proves something did NOT happen
async function quiet(id, ruleId, sec = 20) { await sleep(sec * 1000); return (await execs(id, ruleId)).filter(e => (e.outcome || e.status) !== 'NoMatch' && (e.outcome || e.status) !== 'no_match'); }
const outcome = e => e && (e.outcome || e.status);
// webhook.site receiver (approved 12 Oct 2026) — fresh token per case
async function hook() { for (let i = 0; i < 12; i++) { try { const r = await fetch("https://webhook.site/token", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: "{}" }); const j = await r.json(); if (j.uuid) return { url: "https://webhook.site/" + j.uuid, uuid: j.uuid }; } catch (e) { } await sleep(10000); } throw new Error("webhook.site token failed"); }
async function hookReqs(h) { try { const r = await fetch(`https://webhook.site/token/${h.uuid}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } }); const j = await r.json(); return j.data || []; } catch (e) { return []; } }
const waitHook = (h, n = 1, sec = 45) => waitFor(async () => { const q = await hookReqs(h); return q.length >= n ? q : null; }, sec, 3000);
const WH = (h, body, extra) => ({ type: 'Webhook', url: h.url, method: 'POST', bodyTemplate: body || '{"subject":"${subject}","id":"${recordId}"}', headers: { 'X-QA': 'wf' }, timeoutSeconds: 10, ...(extra || {}) });
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { body_html: `<p>${text || "QA WF comment"}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
async function allRules() { const out = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); out.push(...a); if (a.length < 100) break; } return out; }
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
