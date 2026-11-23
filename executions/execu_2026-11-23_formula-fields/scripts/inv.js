// Read-only inventory of test data for the cleanup. Run per app: node fx.js inv.js crm|desk
const app = made.appKey || 'crm'; const out = { app };
const mods = L((await api('GET', '/modules')).j?.data);
const count = async m => { const r = await api('GET', `/modules/${m}/records?limit=1`); return r.j?.meta?.total_count ?? L(r.j?.data).length; };
out.modules = []; for (const id of [made.mod, made.child].filter(Boolean)) { const m = mods.find(x => x.id === id); out.modules.push({ id, key: m?.moduleKey, exists: !!m, records: m ? await count(id) : 0 }); }
out.workflowRules = (made.wf || []).length; out.blueprints = (made.bps || []).length; out.views = (made.views || []).length; out.importSessions = (made.imports || []).length + (made.importSession ? 1 : 0);
out.layoutB = made.layoutB || null; out.account = made.acc || null;
if (app === 'crm') {
  const fp = await api('GET', `/modules/${made.mod}/field-permissions`); out.fieldPermissions = L(fp.j?.data).length;
  out.live = made.live || null;
  const tpl = L((await api('GET', '/mail/templates')).j?.data).filter(t => /^QA FX/.test(t.name)); out.mailTemplates = tpl.length;
} else {
  out.tickets = made.tickets ? { fields: made.tickets.fields, tickets: made.tickets.tickets.length, rules: (made.tickets.rules || []).length, bps: (made.tickets.bps || []).length } : null;
}
log(JSON.stringify(out, null, 1));
