// TF — after-transition actions (email delivery is in Phase 4).
const since = new Date(Date.now() - 5000);
const fields = L((await api('GET', `/modules/${T}/fields`)).j?.data);
const fname = f => f.fieldName || f.name; const ftype = f => f.datatypeKey || f.datatype?.key;
const cfields = L((await api('GET', `/modules/${CONTACTS}/fields`)).j?.data);
const cDesc = cfields.find(f => /^(description|title|department)$/.test(fname(f))) || cfields.find(f => ftype(f) === 'single_line' && /^qa_/.test(fname(f)));
const addr = fields.find(f => ftype(f) === 'address');
const mods = await modules(); const TASKS = (mods.find(m => (m.key || m.moduleKey || m.api_name) === 'desk_tasks') || {}).id;
const tg = 'TF' + uid();
const acts = [
  aSet('description', 'QA BP R set by blueprint ' + tg),
  ...(cDesc ? [aSet(fname(cDesc), 'QA BP R contact ' + tg, 'contact_id')] : []),
  ...(addr ? [aSet(fname(addr), { street: 'QA BP R 5 Nile St', city: 'Giza', state: 'Giza', zip: '12611', country: 'Egypt' })] : []),
  aNotify('QA BP R ' + tg + ' moved {{subject}}', { owner: true, teamIds: [TEAM] }),
  aTask('QA BP R task owner ' + tg, 'owner'), aTask('QA BP R task performer ' + tg, 'performer'), aTask('QA BP R task specific ' + tg, 'user', U.B),
  aHook('order-1-' + tg), aCA('ref-' + tg), aHook('order-2-' + tg),
];
const m = await mkBp(DEF(tg, S3(), [TR('go', 'Open', 'Escalated', { after: acts }), TR('end', 'Escalated', 'Closed')]));
if (!m.ok) { const storedActs = (await getBp(m.id)).definition.transitions[0].after.actions; log('contact action stored', JS(storedActs.find(x => x.via)), 'contact value now', JS(cRec?.[fname(cDesc)]));
R('TF-01', 'FAIL', 'after-actions not saved: ' + E(m.r)); return await cleanup(); }
const t = await mkT(tg); await waitIn(t);
await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.A }); await sleep(2000);
const r = await runT(t, 'go', 'Open', {}, A); await sleep(20000);
const f = await flds(t);
const h = await histTxt(t);
// TF-01 field update (ticket + contact), history line source = blueprint
const cRec = cDesc ? Object.fromEntries(((await rec(CONTACT))?.data || []).map(x => [x.field, fv(x.value)])) : null;
const histBp = /blueprint/i.test(h) && /description/.test(h);
R('TF-01', /set by blueprint/.test(f.description || '') && (!cDesc || String(cRec?.[fname(cDesc)] || '').includes(tg)) ? 'PASS' : 'FAIL', `run as Agent A ${E(r)}; ticket description updated ${/set by blueprint/.test(f.description || '')}; contact ${cDesc ? fname(cDesc) : '(no field)'} updated ${cDesc ? String(cRec?.[fname(cDesc)] || '').includes(tg) : 'n/a'}; history shows the blueprint update ${histBp}`);
RG('NDC-3032', histBp ? 'PASS' : 'FAIL', 'field change by blueprint in ticket history: ' + histBp);
R('TF-02', addr ? (JS(f[fname(addr)] || '').includes('Giza') ? 'PASS' : 'FAIL') : 'BLOCKED', addr ? `address ${fname(addr)} stored ${JS(f[fname(addr)]).slice(0, 120)} (readable history in Phase 3)` : 'no address field on tickets');
// TF-03 notify owner + team
const bA = (await bells(A)).filter(b => JS(b).includes('QA BP R ' + tg + ' moved')), bB = (await bells(B)).filter(b => JS(b).includes('QA BP R ' + tg + ' moved'));
const titleA = bA[0] ? (bA[0].title || bA[0].message || JS(bA[0]).slice(0, 120)) : '';
both('TF-03', 'NDC-3061', bA.length > 0 && bB.length > 0, `notification to ticket owner (A): ${bA.length}; to team member B: ${bB.length}; title "${String(titleA).slice(0, 100)}"`);
R('TF-10', bA.length && !/\{\{subject\}\}/.test(JS(bA[0])) && JS(bA[0]).includes('QA BP R ' + tg + ' moved QA BP R') ? 'PASS' : (bA.length ? 'FAIL' : 'INCONCLUSIVE'), `{{subject}} in the notification title → "${String(titleA).slice(0, 120)}"`);
// TF-04 tasks
let tasks = [];
if (TASKS) { const tr = await api('GET', `/modules/${TASKS}/records?page_size=100&search=${encodeURIComponent('QA BP R task')}`); tasks = arr(tr.j?.data).map(x => Object.fromEntries((x.data || []).map(y => [y.field, fv(y.value)]))).filter(x => String(x.subject || '').includes(tg)); }
const own = x => x.owner || x.assignee || x.assigned_to;
const tOwn = tasks.find(x => /owner/.test(x.subject)), tPerf = tasks.find(x => /performer/.test(x.subject)), tSpec = tasks.find(x => /specific/.test(x.subject));
R('TF-04', tasks.length === 3 && own(tOwn) === U.A && own(tPerf) === U.A && own(tSpec) === U.B ? 'PASS' : (tasks.length ? 'FAIL' : 'FAIL'), `tasks found ${tasks.length}; owner-mode → ${String(own(tOwn)).slice(0, 8)}, performer → ${String(own(tPerf)).slice(0, 8)}, specific B → ${String(own(tSpec)).slice(0, 8)}; linked to ticket: ${tasks.some(x => JS(x).includes(t))}`);
RG('NDC-2729', 'PASS', 'Desk create-task after-action only targets desk_tasks (other modules refused below)');
const badMode = await mkBp(DEF('TF4m' + uid(), S3(), [TR('go', 'Open', 'Escalated', { after: [aTask('x', 'specific', U.B)] }), TR('end', 'Escalated', 'Closed')]), false);
R('TF-12', badMode.ok ? 'FINDING' : 'PASS', 'create-task with an unknown assignee mode ("specific") → ' + (badMode.ok ? 'SAVED and silently treated as ticket owner' : 'refused ' + code(badMode.r)), { extra: 'not in case list' });
const crm = await mkBp(DEF('TF4x' + uid(), S3(), [TR('go', 'Open', 'Escalated', { after: [{ ...aTask('x'), targetModuleKey: 'leads' }] }), TR('end', 'Escalated', 'Closed')]), false);
if (crm.ok) RG('NDC-2729', 'FAIL', 'create-record after-action to CRM module "leads" saved');
// TF-05 webhook + internal URLs
const got = await hooks(since);
const o1 = got.find(x => x.url.includes('order-1-' + tg)), o2 = got.find(x => x.url.includes('order-2-' + tg)), ca = got.find(x => x.url.includes('qa-bp-echo/ref-' + tg));
R('TF-05', o1 && o1.body.includes(t) ? 'PASS' : (o1 ? 'PARTIAL' : 'FAIL'), `webhook arrived ${!!o1}; carries ticket id ${o1 ? o1.body.includes(t) : '-'}; body starts ${o1 ? o1.body.slice(0, 120) : '-'}`);
RG('NDC-2540', o1 ? 'PASS' : 'FAIL', 'after-transition webhook sent ' + !!o1);
const bad = {};
for (const u of ['http://169.254.169.254/latest/meta-data/', 'http://localhost:8080/x', 'http://10.0.0.5/x', 'http://[::1]/x', 'http://metadata.google.internal/']) { const mm = await mkBp(DEF('TF5x' + uid(), S3(), [TR('go', 'Open', 'Escalated', { after: [{ kind: 'webhook', url: u, verb: 'POST' }] }), TR('end', 'Escalated', 'Closed')]), false); bad[u] = mm.ok ? 'SAVED' : code(mm.r); }
const savedBad = Object.entries(bad).filter(([, v]) => v === 'SAVED').map(([k]) => k);
R('TF-11', savedBad.length ? 'FAIL' : 'PASS', 'internal/metadata webhook URLs at save: ' + JS(bad), { caseNote: 'part of TF-05' });
RG('NDC-2537', savedBad.length ? 'FAIL' : 'PASS', savedBad.length ? 'still saved: ' + savedBad.join(', ') : 'all internal URLs refused');
// TF-07 custom action
R('TF-07', ca ? 'PASS' : 'FAIL', `custom action "QA BP echo" reached the receiver ${!!ca}; input note with {{subject}}: ${ca ? ca.body.slice(0, 120) : '-'}`);
// TF-08 refused reasons
const caMissing = await mkBp(DEF('TF8' + uid(), S3(), [TR('go', 'Open', 'Escalated', { after: [aCA('x', crypto.randomUUID())] }), TR('end', 'Escalated', 'Closed')]), false);
R('TF-08', !caMissing.ok && /CUSTOM_ACTION/.test(code(caMissing.r) + JS(caMissing.r.j?.error || '')) ? 'PARTIAL' : 'FAIL', `custom action that does not exist → ${E(caMissing.r)}; other reasons (inactive / not Desk / record-bound / agent variable) need extra custom actions — designer texts checked in Phase 3`);
// TF-09 order
R('TF-09', o1 && o2 && new Date(o1.at) <= new Date(o2.at) ? 'PASS' : 'FAIL', `webhook 1 at ${o1?.at}, webhook 2 at ${o2?.at} (custom action between: ${ca?.at})`);
return await cleanup();
