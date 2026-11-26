// Final cleanup: leftover QA blueprints/tickets in the dept, QA statuses, Phase 0 data, department; then diff against the start baseline.
const out = { fail: [] };
// 1 any QA BP R blueprint left anywhere + tickets in the QA dept
const bps = (await listBps()).filter(b => /^QA BP R /.test(b.definition?.name || ''));
for (const b of bps) { await api('POST', `/desk/blueprints/${b.id}/revoke`, { ticket_ids: null, after: null }); }
let tickets = []; for (let page = 1; page <= 20; page++) { const r = await api('GET', `/modules/${T}/records?page_size=100&page=${page}`); const rows = arr(r.j?.data); for (const x of rows) { const d = Object.fromEntries((x.data || []).map(f => [f.field, fv(f.value)])); if (/^QA BP R /.test(String(d.subject || ''))) tickets.push(x.id); } const tp = r.j?.meta?.total_pages; if (!rows.length || (tp && page >= tp)) break; }
for (const t of tickets) { const r = await api('DELETE', `/modules/${T}/records/${t}`); if (!(ok(r) || r.s === 404)) out.fail.push('ticket ' + E(r)); }
await sleep(3000);
for (const b of bps) { const r = await api('DELETE', `/modules/${T}/blueprints/${b.id}`); if (!(ok(r) || r.s === 404)) out.fail.push('bp ' + b.definition?.name + ' ' + E(r)); }
out.blueprints = bps.length; out.tickets = tickets.length;
// 2 Recycle Bin: purge QA BP R items
const bin = arr((await api('GET', '/audit/recycle-bin/items?limit=200')).j?.data).filter(x => /QA BP R |QA BP Reg|QA BP echo|QA BP Verify|QA BP Done/.test(JS(x)));
if (bin.length) { const p = await api('POST', '/audit/recycle-bin/delete', { ids: bin.map(x => x.id) }); out.binPurge = bin.length + ' ' + p.s; }
// 3 QA statuses created by this run → remove from the Status field
const fields = L((await api('GET', `/modules/${T}/fields`)).j?.data); const sf = fields.find(f => (f.fieldName || f.name) === 'status');
const before = sf.datatypeOptions?.allowed_values || []; const isQa = v => /^QA BP R |^QA BP Verify$|^QA BP Done$/.test(typeof v === 'string' ? v : v.value);
const keepVals = before.filter(v => !isQa(v));
if (keepVals.length !== before.length) { const r = await api('PUT', `/modules/${T}/fields/${sf.id}`, { fieldName: 'status', labels: sf.labels, datatypeKey: sf.datatypeKey, datatypeOptions: { ...sf.datatypeOptions, allowed_values: keepVals }, required: sf.required, unique: sf.unique }); out.statuses = (before.length - keepVals.length) + ' removed → ' + E(r); }
// 4 Phase 0 data
for (const x of MADE.other) {
  let r = null;
  if (x.kind === 'team') r = await api('DELETE', `/desk/teams/${x.id}`);
  else if (x.kind === 'contact') r = await api('DELETE', `/modules/${CONTACTS}/records/${x.id}`);
  else if (x.kind === 'template') r = await api('DELETE', `/desk/email-templates/${x.id}`);
  else if (x.kind === 'ca_action') r = await api('DELETE', `/workflow/custom-actions/${x.id}`);
  else if (x.kind === 'ca_source') r = await api('DELETE', `/workflow/custom-actions/sources/${x.id}`);
  if (r && !(ok(r) || r.s === 404)) out.fail.push(x.kind + ' ' + E(r));
}
for (const x of MADE.temp) { const p = x.kind === 'wfrule' ? `/workflow/rules/${x.id}` : x.kind === 'sla' ? `/desk/sla/policies/${x.id}` : x.kind === 'holiday' ? `/desk/holiday-lists/${x.id}` : x.kind === 'vrule' ? `/modules/${T}/validation-rules/${x.id}` : null; if (p) await api('DELETE', p); }
// 5 department
const dr = await api('DELETE', `/desk/departments/${DEPT}?transfer_to_department_id=${CS}`); out.dept = E(dr);
// 6 diff with the start baseline
const BASE = JSON.parse(fs.readFileSync(RUN + '/baseline/baseline-start.json', 'utf8'));
const ids = x => { const d = x?.d; const Lx = Array.isArray(d) ? d : (d && (d.statuses || d.teams || d.items || d.email_templates || d.rules)) || []; return Lx.map(i => i.id || i.value).filter(Boolean).sort(); };
const now = { blueprints: (await api('GET', `/modules/${T}/blueprints?includeInactive=true`)).j?.data, statuses: (await api('GET', '/desk/ticket-statuses')).j?.data, departments: (await api('GET', '/desk/departments')).j?.data, teams: (await api('GET', '/desk/teams')).j?.data, customActions: (await api('GET', '/workflow/custom-actions')).j?.data, slaPolicies: (await api('GET', '/desk/sla/policies')).j?.data, happiness: (await api('GET', '/desk/happiness/settings')).j?.data, assignSwitch: (await api('GET', '/desk/assignment/notification-settings')).j?.data, bh: (await api('GET', '/desk/business-hours')).j?.data };
const diff = {};
for (const k of ['blueprints', 'statuses', 'departments', 'teams', 'customActions', 'slaPolicies']) { const a = ids(BASE[k]), b = ids({ d: now[k] }); const add = b.filter(x => !a.includes(x)), rem = a.filter(x => !b.includes(x)); if (add.length || rem.length) diff[k] = { added: add.length, removed: rem.length, addedIds: add.slice(0, 5) }; }
diff.happinessSame = ['is_enabled', 'department_scope_enabled', 'department_ids'].every(k => JS(now.happiness?.[k]) === JS(BASE.happiness.d[k]));
diff.assignSwitchSame = JS(now.assignSwitch) === JS(BASE.assignSwitch.d);
diff.businessHoursSame = ['preset', 'days_active', 'hours', 'time_zone'].every(k => JS(now.bh?.[k]) === JS(BASE.businessHours.d[k])) && (now.bh?.holiday_lists || []).length === (BASE.businessHours.d.holiday_lists || []).length;
out.diff = diff;
fs.writeFileSync(RUN + '/baseline/final-diff.json', JSON.stringify(out, null, 1));
return out;
