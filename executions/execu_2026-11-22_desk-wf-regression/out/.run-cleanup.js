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
async function hook() { for (let i = 0; i < 5; i++) { try { const r = await fetch("https://webhook.site/token", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: "{}" }); const j = await r.json(); if (j.uuid) return { url: "https://webhook.site/" + j.uuid, uuid: j.uuid }; } catch (e) { } await sleep(4000); } throw new Error("webhook.site token failed"); }
async function hookReqs(h) { try { const r = await fetch(`https://webhook.site/token/${h.uuid}/requests?sorting=oldest&per_page=50`, { headers: { accept: 'application/json' } }); const j = await r.json(); return j.data || []; } catch (e) { return []; } }
const waitHook = (h, n = 1, sec = 45) => waitFor(async () => { const q = await hookReqs(h); return q.length >= n ? q : null; }, sec, 3000);
const WH = (h, body, extra) => ({ type: 'Webhook', url: h.url, method: 'POST', bodyTemplate: body || '{"subject":"${subject}","id":"${recordId}"}', headers: { 'X-QA': 'wf' }, timeoutSeconds: 10, ...(extra || {}) });
const comment = (id, pub, text) => api('POST', `/desk/tickets/${id}/comments`, { body_html: `<p>${text || "QA WF comment"}</p>`, is_public: !!pub });
const reply = (id, b) => api('POST', `/desk/tickets/${id}/replies`, { mode: 'reply', to: [QA_EMAIL], subject: 'Re: QA WF', body_html: '<p>QA WF agent reply</p>', ...(b || {}) });
const delTicket = id => api('DELETE', `/modules/${T}/records/${id}`);
const FU = (o) => ({ type: 'FieldUpdate', fieldUpdates: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? v : S(v)])) });
const fired = async (tid, rid) => (await execs(tid, rid)).filter(e => outcome(e) === 'Fired').length;
async function allRules() { const out = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); out.push(...a); if (a.length < 100) break; } return out; }
// Cleanup everything this run created: QA WF rules, saved actions, tickets, contacts, account, tags; then purge QA WF items from the Recycle Bin.
const out = {}; const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n');
const ids = re => [...new Set(LG.filter(l => re.test(l)).map(l => (l.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\s*$/) || [])[1]).filter(Boolean))];
// rules by name (all pages)
const rules = (await allRules()).filter(r => /^QA WF /.test(r.name) || r.name.includes('<script>'));
let rd = 0; for (const r of rules) { const d = await api('DELETE', '/workflow/rules/' + r.id); if (d.s < 300) rd++; }
out.rules = rd + '/' + rules.length;
// saved actions
const acts = arr((await api('GET', '/workflow/actions')).j?.data).filter(a => /^QA WF /.test(a.name)); let ad = 0; for (const a of acts) if ((await api('DELETE', '/workflow/actions/' + a.id)).s < 300) ad++; out.actions = ad + '/' + acts.length;
// tickets
const tix = ids(/ ticket "QA WF /); let td = 0, tgone = 0; for (const id of tix) { const d = await api('DELETE', `/modules/${T}/records/${id}`); if (d.s < 300) td++; else if (d.s === 404) tgone++; }
out.tickets = `${td} deleted, ${tgone} already gone, of ${tix.length}`;
// contacts + account (+ contacts created by the Create Record action)
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const cons = [...ids(/contact "QA WF /), '57af0d4e-1f32-4afc-9618-9cabae2bca26'];
const more = arr((await api('GET', `/modules/${CM}/records?take=100`)).j?.data).filter(r => (r.data || []).some(x => x.field === 'name' && /^QA WF /.test(dec(x.value) || ''))).map(r => r.id);
let cd = 0; const allC = [...new Set([...cons, ...more])]; for (const id of allC) if ((await api('DELETE', `/modules/${CM}/records/${id}`)).s < 300) cd++; out.contacts = cd + '/' + allC.length;
let acd = 0; const accs = ids(/account "QA WF /); for (const id of accs) if ((await api('DELETE', `/modules/${AM}/records/${id}`)).s < 300) acd++; out.accounts = acd + '/' + accs.length;
await sleep(5000);
// tags
const tg = { 'QA WF tagA': 'a41004d3-79e9-42bb-acd5-ad7fb363389b', 'QA WF tagB': '0fc9d573-2de6-4fc1-8400-ab8cb5092b2d', 'zz wf c': '7397b50e-30dd-4ebb-9abf-7e9468a7cc82', 'zz wf d': 'ba388a87-99b7-491e-ab91-2bba95ccd60a' };
out.tags = {}; for (const [n, id] of Object.entries(tg)) { const d = await api('DELETE', '/desk/tags/' + id); out.tags[n] = d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 120) : ''); }
// recycle bin purge of QA WF items
let purged = 0; const leftBin = [];
for (let pass = 0; pass < 3; pass++) {
  const bin = await api('GET', '/audit/recycle-bin?take=200&app_key=desk'); const items = arr(bin.j?.data);
  const qa = items.filter(i => /QA WF |QA WF$|zz wf/.test(JSON.stringify([i.label, i.name, i.title, i.display_name, i.record_label])));
  if (!qa.length) break;
  const d = await api('POST', '/audit/recycle-bin/delete', { ids: qa.map(i => i.id) }); if (d.s < 300) purged += qa.length; else { leftBin.push(d.s + ' ' + d.t.slice(0, 150)); break; }
}
out.binPurged = purged; out.binErr = leftBin;
// verify
const left = (await allRules()).filter(r => /^QA WF /.test(r.name)).length;
const stillT = []; for (const id of tix.slice(0, 400)) { const g = await api('GET', `/modules/${T}/records/${id}`); if (g.s === 200 && !(g.j?.data?.is_deleted)) stillT.push(id); }
out.verify = { rulesLeft: left, ticketsLeft: stillT.length, savedActionsLeft: arr((await api('GET', '/workflow/actions')).j?.data).filter(a => /^QA WF /.test(a.name)).length, activeRulesNow: (await allRules()).filter(r => r.isActive).map(r => r.name) };
ledger('CLEANUP ' + JSON.stringify(out).slice(0, 600));
fs.writeFileSync(RUN + '/out/cleanup.json', JSON.stringify(out, null, 1));
return out;
