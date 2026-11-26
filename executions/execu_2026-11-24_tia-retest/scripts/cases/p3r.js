// Group R — restore. SUB=crm|desk|chats|verify
const SUB = process.env.SUB; const I = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); const B = JSON.parse(fs.readFileSync(RUN + '/out/p3-baseline.json', 'utf8')); const o = {};
const find = async (mod, field, val, op = 'starts_with') => arr((await api('GET', `/modules/${mod}/records?page=1&per_page=100&filters=${encodeURIComponent(JSON.stringify([{ field, operator: op, value: val }]))}`)).j?.data).map(x => x.id);
if (SUB === 'crm') {
  const L = M.leads; const ids = new Set([I.leadA, I.leadB, I.leadLock, I.wfLead, I.e03, I.e04, ...(I.extraLeads || [])].filter(Boolean));
  for (const f of ['first_name', 'name']) for (const v of ['QA TIA P3', 'QA-P3']) (await find(L, f, v)).forEach(x => ids.add(x));
  o.leads = {}; for (const id of ids) o.leads[id.slice(0, 8)] = (await api('DELETE', `/modules/${L}/records/${id}`)).s;
  const TASKS = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; o.tasks = []; for (const id of await find(TASKS, 'subject', 'QA TIA P3')) o.tasks.push((await api('DELETE', `/modules/${TASKS}/records/${id}`)).s);
  if (I.wf) o.wf = (await api('DELETE', `/workflow/rules/${I.wf}`)).s;
  if (I.vr) o.vr = (await api('DELETE', `/modules/${L}/validation-rules/${I.vr}`)).s;
  if (I.lock) o.lock = (await api('DELETE', `/modules/${L}/record-locks/${I.lock}`)).s;
  const fp = arr((await api('GET', `/modules/${L}/field-permissions`)).j?.data).filter(x => x.profileId === I.crmManagerProfile && x.fieldName === 'title'); o.fp = []; for (const x of fp) o.fp.push((await api('DELETE', `/modules/${L}/field-permissions/${x.id}`)).s);
  ledger('P3 R-02/R-03 CRM: ' + JSON.stringify(o)); return o;
}
if (SUB === 'desk') {
  const T = M.tickets; const ids = new Set([I.t1, I.t2, I.t3, I.t4, I.tOther, I.e01, I.e07].filter(Boolean)); (await find(T, 'subject', 'QA TIA P3')).forEach(x => ids.add(x));
  o.tickets = {}; for (const id of ids) o.tickets[id.slice(0, 8)] = (await api('DELETE', `/modules/${T}/records/${id}`)).s;
  const art = arr((await api('GET', '/desk/kb/articles?limit=200')).j?.data).filter(x => /QA TIA P3/.test(x.title || '')); o.articles = []; for (const a of art) o.articles.push((await api('DELETE', `/desk/kb/articles/${a.id}`)).s);
  ledger('P3 R-02 Desk: ' + JSON.stringify(o)); return o;
}
if (SUB === 'chats') {
  const RX = /QA TIA P3|QA P3|QA-P3|ORCHID|code word|refund window|According to our knowledge|Summarise the (ticket|lead) "QA|Find the lead whose first name is "QA|How many open chats|Show me the transcript of the most recent chat|Who is the most recent visitor|Which operators are online|How many leads are there in CRM, and how many open tickets|List the reports I have|Summarise the first dashboard|كم عدد (المحادثات|التقارير)|Change the (company|lead source|priority|status) of|Set the (Title|Single Line|status)|On the lead named "QA-P3|Remove \(clear\)|Create a (lead|ticket) with (first name QA TIA P3|subject "QA TIA P3)|Delete the ticket "QA TIA P3|Set the lead source to Partner on all leads|What is the value of the (Single Line|field with API name)/;
  const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data); const del = all.filter(c => RX.test(c.title || '') && String(c.updated_at) > '2026-11-25T11:3');
  o.found = del.length; o.del = {}; for (const c of del) { const s = (await api('DELETE', `/agents/tia/conversations/${c.id}`)).s; o.del[s] = (o.del[s] || 0) + 1; }
  o.kept = all.length - del.length; ledger(`P3 R: ${process.env.WHO} test chats deleted ${JSON.stringify(o.del)}`); return o;
}
if (SUB === 'verify') {
  const a = await getAgent(); o.tia = { ver: a.deployed_version_no, same: JSON.stringify(a.draft_definition) === JSON.stringify(B.agent.def), undeployed: a.has_undeployed_changes };
  const p = (await api('GET', '/ai/policy')).j?.data; o.policy = { tia: p?.descriptor?.features?.tia, sameAsBaseline: JSON.stringify(p?.descriptor?.features?.tia) === JSON.stringify(B.policy.tia) };
  const cnt = async id => { const r = await api('GET', `/iam/profiles/${id}/permissions`); const d = r.j?.data; const l = Array.isArray(d) ? d : d?.permissions || []; return { n: l.length, tia: l.some(x => x.permissionKey === 'ai:tia:use') }; };
  o.deskAgent = await cnt(DESK_AGENT_PROFILE); o.crmManager = await cnt(I.crmManagerProfile); o.baseline = { deskAgent: B.deskAgentPerms, crmManager: B.crmManager.perms };
  const fp = arr((await api('GET', `/modules/${M.leads}/field-permissions`)).j?.data); o.leadsFieldPerms = fp.length + ' (baseline ' + B.leadsFieldPerms.length + ')';
  o.qaLeads = (await find(M.leads, 'first_name', 'QA TIA P3')).length + (await find(M.leads, 'name', 'QA-P3')).length; o.qaRules = arr((await api('GET', '/workflow/rules?limit=300')).j?.data).filter(r => /QA TIA P3/.test(r.name || '')).length;
  o.vr = arr((await api('GET', `/modules/${M.leads}/validation-rules`)).j?.data).filter(r => /QA TIA P3/.test(r.name || '')).length; o.locks = arr((await api('GET', `/modules/${M.leads}/record-locks`)).j?.data).filter(r => /QA TIA P3/.test(r.name || '')).length;
  o.kbDocs = arr((await api('GET', '/agents/kb/documents')).j?.data).filter(d => /qa-tia-p3/i.test(d.name)).length;
  return o;
}
