module.exports = async ({ page, api, log }) => {
  await require('./nav.js').leads(page);
  const r = await api('GET', '/crm/v8/settings/blueprints'); const j = JSON.parse(r.body);
  for (const b of j.blueprints||[]) log(b.id, b.name||'', b.module?.api_name, b.status, b.layout?.name, b.field?.api_name);
};
