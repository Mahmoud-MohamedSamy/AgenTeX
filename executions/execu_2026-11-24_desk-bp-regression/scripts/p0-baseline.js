// Phase 0: read-only baseline of everything the regression may touch. Writes ../baseline/baseline-<label>.json
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const label = (typeof process !== 'undefined' && process.env.BL) || 'start';
const g = async p => { const r = await api('GET', p); return { s: r.s, d: r.j ? (r.j.data !== undefined ? r.j.data : r.j) : r.t.slice(0, 300) }; };
const b = {};
b.at = new Date().toISOString();
b.blueprints = await g(`/modules/${TK}/blueprints?includeInactive=true`);
b.statuses = await g('/desk/ticket-statuses');
b.departments = await g('/desk/departments');
b.teams = await g('/desk/teams');
b.businessHours = await g('/desk/business-hours');
b.holidayLists = await g('/desk/holiday-lists');
b.happiness = await g('/desk/happiness/settings');
b.assignSwitch = await g('/desk/assignment/notification-settings');
b.slaPolicies = await g('/desk/sla/policies');
b.emailTemplates = await g('/email-templates?module=desk_tickets');
b.customActions = await g('/workflow/custom-actions');
// workflow rules: list caps at 50, so also search by name for the teammate rules we care about
b.wfRules = await g(`/workflow/rules?moduleId=${TK}&page_size=200`);
b.wfSearch = {};
for (const q of ['AC-07', 'test workflow', 'QA BP']) b.wfSearch[q] = await g(`/workflow/rules?moduleId=${TK}&search=${encodeURIComponent(q)}`);
fs.writeFileSync(`../baseline/baseline-${label}.json`, JSON.stringify(b, null, 1));
const n = x => Array.isArray(x.d) ? x.d.length : (x.d && (x.d.items || x.d.statuses || x.d.rules || x.d.policies)) ? (x.d.items || x.d.statuses || x.d.rules || x.d.policies).length : JSON.stringify(x.d).length + 'b';
const sum = {}; for (const [k, v] of Object.entries(b)) if (v && v.s) sum[k] = v.s + ' ' + n(v);
sum.blueprintNames = arr(b.blueprints.d).map(x => (x.definition?.name || x.name) + (x.isActive ? ' [active]' : '') + ' ' + (x.departmentName || x.definition?.departmentId || '').toString().slice(0, 8));
sum.wfSearch = Object.fromEntries(Object.entries(b.wfSearch).map(([k, v]) => [k, arr(v.d).map(x => x.name + ':' + (x.isActive ?? x.is_active))]));
return sum;
