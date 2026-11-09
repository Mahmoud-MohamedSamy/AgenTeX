// NDC-2321: assignment rule (channel Api → U1) + workflow On Create Field Update (Description) + blueprint (rating) on "QA RT 2321" leads.
// Create one lead through the API → its timeline must show: owner change naming the rule, a workflow field-update row, a blueprint entry row, in order.
const out = {}; const G = 'QA RT 2321 '; const offs = []; const t = String(Date.now()).slice(-5);
try {
  const ar = await X.made('o', '/workflow/assignment-rules', { moduleId: T.LEADS, layoutId: null, name: G + 'AR ' + t, description: null, priority: 10, allowedChannels: ['Api'], fallback: { kind: 'LeaveUnassigned', userId: null, poolCriteria: null },
    entries: [{ condition: X.startsWith('first_name', G + 'lead'), target: { kind: 'Category', members: [{ userId: T.U1, order: 0, kind: 'User' }], poolCriteria: null }, availability: { requireOnline: false, requireOnShift: false }, followUpTask: null }], isActive: false }, 'assignment rule');
  const arId = ar.j?.data?.id; out.ar = ar.s;
  if (arId) { const cur = (await api('o', 'GET', '/workflow/assignment-rules/' + arId)).j?.data; out.arOn = (await api('o', 'PATCH', '/workflow/assignment-rules/' + arId, { ...cur, isActive: true })).s; offs.push(async () => (await api('o', 'PATCH', '/workflow/assignment-rules/' + arId, { ...cur, isActive: false })).s); }
  const w = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'WF ' + t, G + 'lead', { actions: [X.fieldUpdate('description', 'WF 2321')] }), 'workflow rule');
  const wid = w.j?.data?.id; if (wid) { out.wfOn = (await api('o', 'POST', `/workflow/rules/${wid}/activate`)).s; offs.push(async () => (await api('o', 'POST', `/workflow/rules/${wid}/deactivate`)).s); }
  const bp = await api('o', 'POST', `/modules/${T.LEADS}/blueprints`, X.blueprint('leads', T.LEADS_STD, null, 'rating', G + 'BP ' + t, X.bpCrit('first_name', G + 'lead'), ['acquired', 'active'], []));
  const bid = bp.j?.data?.id; out.bp = bp.s;
  if (bid) { ledger(`blueprint ${bid} "${G}BP ${t}" (Leads)`); const c = (await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${bid}`)).j?.data; out.bpOn = (await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${bid}`, { isActive: true, definition: c.definition })).s;
    offs.push(async () => { const c2 = (await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${bid}`)).j?.data; return (await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${bid}`, { isActive: false, definition: c2.definition })).s; }); }
  const l = (await X.lead('o', G + 'lead ' + t, { rating: 'acquired' })).j?.data?.id; out.lead = l; await sleep(30000);
  out.owner = (await X.field('o', T.LEADS, l, 'owner')) === T.U1 ? 'U1 (rule user)' : await X.field('o', T.LEADS, l, 'owner');
  out.description = await X.field('o', T.LEADS, l, 'description');
  out.feed = arr((await api('o', 'GET', `/timeline/records/leads/${l}/feed`)).j?.data).reverse().map(e => ({ type: e.entry_type, actor: e.actor_display_name || e.actor_name || e.actor_label || e.actor_type || null, payload: String(e.payload_json || '').replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 220), refs: JSON.stringify(e.references || e.refs || null).slice(0, 160) }));
} finally { out.off = []; for (const f of offs.reverse()) out.off.push(await f()); }
return out;
