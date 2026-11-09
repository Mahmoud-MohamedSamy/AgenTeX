// Builds c6-blueprints.json (TAVI blueprint definitions) from NDC's captured blueprints. Prints every mapping problem.
const fs = require('fs'), Z = '../ndc-zoho/', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const R = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const b = R(Z + 'ndc-core-build.json'), fmap = R('field-map.json'), smap = R('status-map.json'), dids = R('dept-ids.json'), tids = R('team-ids.json'), A = R('agents.json');
const org = R(Z + 'api/organizationFields_module_tickets.json').data; const fById = {}; org.forEach(f => fById[f.id] = f);
const ndcDeps = R(Z + 'api/departments_limit_100.json').data; const dName = {}; ndcDeps.forEach(d => dName[d.id] = d.name);
const ndcTeam = {}; fs.readdirSync(Z + 'api').filter(x => /^departments_\d+_teams\.json$/.test(x)).forEach(x => (R(Z + 'api/' + x).teams || []).forEach(t => ndcTeam[t.id] = dName[t.departmentId] + ' / ' + t.name));
const fu = {}, al = {}; fs.readdirSync(Z + 'api').forEach(x => { if (/^automationFieldUpdates_/.test(x)) { const o = R(Z + 'api/' + x); fu[o.id] = o; } if (/^automationAlerts_/.test(x)) { const o = R(Z + "api/" + x); al[o.alertId || o.id] = o; } });
const problems = []; const slug = s => s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 40);
const sysMap = { status: 'status', priority: 'priority', assigneeId: 'owner', teamId: 'team', dueDate: 'due_date', classification: 'classification', category: 'category', subCategory: 'sub_category', resolution: 'resolution', description: 'description', subject: 'subject', channel: 'channel', departmentId: 'department' };
const ourField = zApi => sysMap[zApi] || (fmap[zApi] && fmap[zApi].fieldName) || null;
const ourType = api => { const d = (R('created/fields-after2.json').data).find(x => x.apiName === api); return d ? d.datatypeKey : 'single_line'; };
const statusVal = v => { const m = { '${CLOSED}': 'Closed', '${OPEN}': 'Open', '${ONHOLD}': 'On Hold' }; return m[v] || smap[v] || v; };
const owners = { allowedUserIds: [A['mahmoud.mahamed1515@gmail.com']] };
const calls = [];
for (const { dept, b: bp } of b.blueprints) {
  const did = dids[dept]; if (!did) { problems.push('no dept ' + dept); continue; }
  const states = bp.states.map((s, i) => { const v = statusVal(s.name); if (!smap[s.name] && !['Open', 'Closed', 'On Hold', 'Escalated'].includes(s.name)) problems.push(bp.name + ': state not a status ' + s.name);
    const o = { id: v, name: v, position: { x: (i % 4) * 300, y: Math.floor(i / 4) * 200 }, slaClock: 'business' }; if (s.type === 'END') o.isTerminal = true; if (s.type === 'START') o.isStart = true; return o; });
  const tById = {}; bp.transitions.forEach(t => tById[t.id] = t);
  const transitions = [];
  for (const c of bp.connections || []) for (const tr of c.transitions) {
    const t = tById[tr.id]; if (!t) continue;
    const ow = ((t.before || {}).accessors || {}).owners || {}; const before = {};
    if ((ow.otherRecpts || []).includes('RECORD_OWNER')) before.allowOwner = true;
    const teamIds = (ow.teamIds || []).map(id => tids[ndcTeam[id]]).filter(Boolean); if ((ow.teamIds || []).length && !teamIds.length) problems.push(bp.name + '/' + t.name + ': owner team not mapped ' + ow.teamIds.map(i => ndcTeam[i]).join(','));
    if (teamIds.length) before.teamIds = teamIds; if ((ow.agentIds || []).length) before.allowedUserIds = owners.allowedUserIds;
    const req = []; for (const d of t.during || []) { const f = fById[(d.fieldUpdates || {}).fieldId]; const api = f && ourField(f.apiName); if (!api) { problems.push(bp.name + '/' + t.name + ': during field ' + (f ? f.displayLabel : d.fieldUpdates && d.fieldUpdates.fieldId)); continue; } req.push({ name: api, datatype: { key: ourType(api) }, required: !!d.isMandatory }); }
    const actions = [];
    for (const id of ((t.after || {}).fieldUpdate || {}).ids || []) { const u = fu[id]; if (!u) { problems.push('fu missing ' + id); continue; }
      for (const [k, v] of Object.entries(u.fieldsToUpdate || {})) { const api = ourField(k); if (!api) { problems.push(bp.name + '/' + t.name + ': set field ' + k); continue; }
        let val = v; if (api === 'status') val = statusVal(v); if (api === 'team') { val = tids[ndcTeam[v]] || null; if (!val) problems.push(bp.name + '/' + t.name + ': set team ' + (ndcTeam[v] || v)); } if (api === 'owner' && /Unassigned/.test(String(v))) val = null;
        if (val !== undefined) actions.push({ kind: 'setField', field: api, value: val }); } }
    for (const id of ((t.after || {}).alert || {}).ids || []) { const a = al[id]; if (!a) { problems.push('alert missing ' + id); continue; } const r = a.recipients || {};
      actions.push({ kind: 'sendNotification', title: 'QA NDC ' + (a.name || 'Blueprint alert'), body: 'NDC mimic of alert "' + (a.name || '') + '" on transition ' + t.name, notifyOwner: !!r.notifyRecordOwner || !((r.agents || []).length || (r.teams || []).length) }); }
    const o = { id: slug(t.name) + '-' + transitions.length, name: t.name, fromStateId: statusVal(c.fromState.name), toStateId: statusVal(c.toState.name), before, during: req.length ? { requiredFields: req } : {}, after: { actions } };
    if (t.isCommonTransition) o.isCommon = true; transitions.push(o);
  }
  const def = { name: 'QA NDC ' + bp.name, description: 'NDC mimic of blueprint "' + bp.name + '" (' + dept + ')', moduleKey: 'desk_tickets', targetField: 'status', departmentId: did, states, transitions };
  calls.push({ m: 'POST', p: '/modules/' + T + '/blueprints', b: { definition: def, isActive: !!bp.active }, save: 'bp-' + slug(bp.name) });
}
fs.writeFileSync('c6-blueprints.json', JSON.stringify(calls, null, 1));
console.log('blueprints', calls.length, 'transitions', calls.map(c => c.b.definition.name + ':' + c.b.definition.transitions.length).join(', '));
console.log('problems', problems.length); problems.slice(0, 40).forEach(p => console.log('  -', p));
