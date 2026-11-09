// Read-only discovery on NDC-Staging as the owner: modules, blueprints, teams, templates, ticket statuses.
const n = require('./ndc'); const fs = require('fs');
(async () => {
  const o = {};
  const m = await n.call('owner', 'GET', '/modules'); const mods = (m.json && m.json.data) || [];
  o.modules = mods.map(x => ({ id: x.id, key: x.key || x.moduleKey || x.api_name, name: x.name || (x.labels && x.labels.plural) })).filter(x => /ticket|task|contact/i.test(JSON.stringify(x)));
  const tk = o.modules.find(x => /tickets/i.test(x.key || '') || /^tickets$/i.test(x.name || '')); o.ticketsModule = tk && tk.id;
  if (tk) { const b = await n.call('owner', 'GET', `/modules/${tk.id}/blueprints?includeInactive=true`); o.blueprints = ((b.json && b.json.data) || []).map(x => ({ id: x.id, name: x.name || (x.definition && x.definition.name), active: x.isActive ?? x.is_active, dept: x.departmentId || (x.definition && x.definition.departmentId), crit: JSON.stringify(x.definition && x.definition.entryCriteria) })); }
  for (const p of ['/desk/teams', '/teams', '/desk/email-templates', '/desk/templates/email', '/desk/departments', '/desk/ticket-statuses', '/notifications?limit=3', '/desk/notifications?limit=3']) {
    const r = await n.call('owner', 'GET', p); o[p] = { status: r.status, sample: r.text.slice(0, 600) };
  }
  fs.writeFileSync(process.env.SCR_OUT || 'ndc-discover.out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1).slice(0, 6000));
})().catch(e => console.error('ERR', e.message));
