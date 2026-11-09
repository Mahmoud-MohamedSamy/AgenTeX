// Builds c7-workflows.json (TAVI workflow rules) from NDC's 82 workflows. Every mapping compromise is listed in
// wf-notes.json so it can go into the comparison report. NDC email addresses are never copied: replies/alerts go to the
// QA inbox only.
const fs = require('fs'), Z = '../ndc-zoho/', T = '88e8ea44-1658-4df3-9930-d0902b91073d', SAFE = 'mahmoud.mmohamedsamy@gmail.com';
const R = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const b = R(Z + 'ndc-core-build.json'), fmap = R('field-map.json'), smap = R('status-map.json'), dids = R('dept-ids.json'), tids = R('team-ids.json'), lids = R('layout-ids.json'), A = R('agents.json');
const org = R(Z + 'api/organizationFields_module_tickets.json').data; const fById = {}; org.forEach(f => fById[f.id] = f);
const ndcDeps = R(Z + 'api/departments_limit_100.json').data; const dName = {}; ndcDeps.forEach(d => dName[d.id] = d.name);
const ndcTeam = {}; fs.readdirSync(Z + 'api').filter(x => /^departments_\d+_teams\.json$/.test(x)).forEach(x => (R(Z + 'api/' + x).teams || []).forEach(t => ndcTeam[t.id] = dName[t.departmentId] + ' / ' + t.name));
const statuses = R('created/status-after.json').data.statuses; const byType = t => statuses.filter(s => s.type === t).map(s => s.value);
const layoutOf = dept => { const e = Object.entries(lids).find(([n, v]) => (v.depts || []).includes(dids[dept])); return e ? e[1].id : '1b55c25d-eb27-4046-afd1-b292398b435b'; };
const sys = { status: 'status', priority: 'priority', assigneeId: 'owner', teamId: 'team', channel: 'channel', classification: 'classification', category: 'category', subCategory: 'sub_category', subject: 'subject', description: 'description', departmentId: 'department', dueDate: 'due_date' };
const fieldOf = z => sys[z] || (fmap[z] && fmap[z].fieldName) || null;
const sv = s => ({ kind: 'string', stringValue: String(s) });
const notes = []; const note = (w, m) => notes.push({ rule: w.name.trim(), dept: dName[w.departmentId], note: m });
const evMap = { CUSTOMER_REPLY: 'customer_reply', AGENT_RESPONSE: 'agent_response', AGENT_PRIVATE_COMMENT_ADD: 'comment', AGENT_PUBLIC_COMMENT_ADD: 'comment', CUSTOMER_COMMENT_ADD: 'comment', HAPPINESS_RATING: 'rating', PRIVATE_INCOMING: 'private_thread', PRIVATE_OUTGOING: 'private_thread' };
function valuesFor(field, vals) { const out = []; for (const v of vals) { const s = String(v); if (field === 'status') { if (s === '${OPEN}') out.push(...byType('open')); else if (s === '${ONHOLD}') out.push(...byType('on_hold')); else if (s === '${CLOSED}') out.push(...byType('closed')); else out.push(smap[s] || s); } else out.push(s); } return [...new Set(out)]; }
function crit(w) {
  const c = w.criteria || {}; const fc = c.fieldConditions || []; if (!fc.length) return null;
  const nodes = fc.map(x => { const z = x.staticFieldName || x.fieldName; const f = fieldOf(z === 'Status' ? 'status' : z);
    if (!f) { note(w, 'criterion on "' + (x.i18nLabel || x.fieldName) + '" not mapped (dropped)'); return null; }
    const vals = valuesFor(f, x.value || []); const neg = /isn.t|is not/i.test(x.condition);
    if (/contains/i.test(x.condition)) return { kind: 'StringMatch', field: f, operator: 'Contains', stringValue: vals[0], negate: neg };
    return { kind: 'Membership', field: f, negate: neg, values: vals.map(sv) }; });
  const pat = (c.pattern || fc.map((_, i) => i + 1).join('and')).replace(/\s+/g, '').toLowerCase();
  let i = 0; const tok = pat.match(/\d+|and|or|\(|\)/g) || [];
  const expr = () => { let l = term(); while (tok[i] === 'or') { i++; l = { kind: 'Logical', operator: 'Or', operands: [l, term()] }; } return l; };
  const term = () => { let l = fac(); while (tok[i] === 'and') { i++; l = { kind: 'Logical', operator: 'And', operands: [l, fac()] }; } return l; };
  const fac = () => { const t = tok[i++]; if (t === '(') { const e = expr(); i++; return e; } return nodes[+t - 1]; };
  const clean = n => { if (!n) return null; if (n.kind !== 'Logical') return n; const ops = n.operands.map(clean).filter(Boolean); return ops.length === 0 ? null : ops.length === 1 ? ops[0] : { ...n, operands: ops }; };
  return clean(expr());
}
function triggers(w) {
  const e = w.executeOn || {}; const ev = e.events || []; const tf = (e.triggerFieldInfo && e.triggerFieldInfo.fieldIds || []).map(id => { const f = fById[id]; const z = f ? f.apiName : null; const our = z ? fieldOf(z) : null; if (!our) note(w, 'trigger field ' + (f ? f.displayLabel : id) + ' not mapped'); return our; }).filter(Boolean);
  const base = ev.filter(x => x === 'CREATE' || x === 'EDIT'); const conv = [...new Set(ev.filter(x => evMap[x]).map(x => evMap[x]))]; const out = [];
  if (base.length) { let t;
    if (base.length === 2) t = tf.length ? { kind: 'SpecificFieldChanged', fieldNames: tf, fieldMatch: 'any', alsoOnCreate: true } : { kind: 'RecordCreatedOrUpdated' };
    else if (base[0] === 'CREATE') t = { kind: 'RecordCreated' };
    else t = tf.length ? { kind: 'SpecificFieldChanged', fieldNames: tf, fieldMatch: 'any' } : { kind: 'RecordUpdated' };
    out.push(t); }
  if (conv.length) out.push({ kind: 'TicketEvent', ticketEvents: { events: conv } });
  if (base.length && conv.length) note(w, 'one Zoho rule fires on record AND conversation events; TAVI needs two rules (split)');
  return out;
}
function actions(w) {
  const out = []; let o = 0;
  for (const a of (b.workflows.find(x => x.w.id === w.id).actions || [])) { if (!a) continue; const p = {}; (a.actionParamMappings || []).forEach(m => p[m.name] = m.value);
    if (a.actionName === 'Share Ticket') { const dn = dName[p['Department Name']]; const did = dids[dn]; if (!did) { note(w, 'share target ' + dn + ' not built'); continue; }
      out.push({ type: 'ShareTicket', order: o++, shareDepartmentId: did, shareAccess: ({ READ_ONLY: 'read_only', FULL_ACCESS: 'full', RESTRICTED: 'restricted' })[p.Permission] || 'read_only' }); }
    else if (a.actionName === 'Assign Ticket') { const team = tids[ndcTeam[p['Team Name']]];
      if (p['Team Name'] && !team) note(w, 'assign team ' + (ndcTeam[p['Team Name']] || p['Team Name']) + ' not built (outside core departments)');
      if (team) out.push({ type: 'OwnerAssignment', order: o++, ownerTargetKind: 'Team', ownerValue: team });
      if (p.Assignee === 'TEAM_WITH_AGENT' && p['Agent Name']) { out.push({ type: 'OwnerAssignment', order: o++, ownerTargetKind: 'SpecificUser', ownerValue: A['mahmoud.mahamed1515@gmail.com'] }); note(w, 'Zoho assigns team + agent in one action; TAVI uses two OwnerAssignment actions (agent mapped to a test agent)'); } }
    else if (a.actionName === 'Send Email Reply') { const body = String(p['Ticket Reply'] || '').replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, SAFE);
      out.push({ type: 'SendTicketReply', order: o++, replyIncludeContact: true, replyTo: [SAFE], replySubject: 'QA NDC ' + w.name.trim(), replyBody: body || '<p>QA NDC reply</p>' }); note(w, 'email reply recipients replaced by the QA inbox (NDC addresses not copied)'); }
    else if (a.actionName === 'Execute Skill Based Assignment') out.push({ type: 'ReassignTicketBySkills', order: o++ });
    else note(w, 'action ' + a.actionName + ' not mapped'); }
  for (const id of w.automationFieldUpdateIds || []) { const u = R(Z + 'api/automationFieldUpdates_' + id + '.json'); const fu = {};
    for (const [k, v] of Object.entries(u.fieldsToUpdate || {})) { const f = fieldOf(k);
      if (f === 'team') { const t = tids[ndcTeam[v]]; if (t) out.push({ type: 'OwnerAssignment', order: o++, ownerTargetKind: 'Team', ownerValue: t }); else note(w, 'field update team ' + (ndcTeam[v] || v) + ' not built'); continue; }
      if (f === 'owner') { note(w, 'field update "owner = unassigned" has no TAVI action (owner changes only through assignment)'); continue; }
      if (!f) { note(w, 'field update ' + k + ' not mapped'); continue; } fu[f] = sv(f === 'status' ? (smap[v] || v) : v); }
    if (Object.keys(fu).length) out.push({ type: 'FieldUpdate', order: o++, fieldUpdates: fu }); }
  for (const id of w.automationAlertIds || []) { out.push({ type: 'Email', order: o++, emailRecipients: [SAFE], emailSubject: 'QA NDC alert: ' + w.name.trim(), emailBody: '<p>NDC mimic of workflow alert "' + w.name.trim() + '".</p>' }); note(w, 'alert recipients replaced by the QA inbox'); }
  for (const a of w.actions || []) if (a.type === 'REASSIGN') note(w, 'REASSIGN action (Zoho re-runs assignment) mapped to nothing');
  return out;
}
const calls = [];
for (const { w } of b.workflows) {
  const dept = dName[w.departmentId]; const did = dids[dept]; if (!did) continue;
  const acts = actions(w); if (!acts.length) { note(w, 'no TAVI action left — rule skipped'); continue; }
  const trs = triggers(w); const cr = crit(w);
  trs.forEach((t, k) => calls.push({ m: 'POST', p: '/workflow/rules', save: 'wf-' + w.id + '-' + k,
    b: { moduleId: T, appKey: 'desk', layoutId: layoutOf(dept), departmentIds: [did], name: ('QA NDC ' + w.name.trim() + (trs.length > 1 ? (k ? ' (events)' : ' (record)') : '')).slice(0, 120), description: 'NDC mimic of workflow "' + w.name.trim() + '" (' + dept + ')', trigger: t, criteria: cr, mode: 'Recurring', isActive: w.status === 'ACTIVE', actions: acts } }));
}
fs.writeFileSync('c7-workflows.json', JSON.stringify(calls, null, 1)); fs.writeFileSync('wf-notes.json', JSON.stringify(notes, null, 1));
const cnt = {}; notes.forEach(n => { const k = n.note.replace(/"[^"]*"|\b[A-Z][\w -]+ \/ [\w -]+/g, '…'); cnt[k] = (cnt[k] || 0) + 1; });
console.log('rules to create', calls.length, '| notes', notes.length); Object.entries(cnt).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + v + 'x ' + k));
