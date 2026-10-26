// Read-only: module by id, link detail, datatype usage.
const m = await api('GET', '/modules/01727195-e2d5-41c5-821b-a30d5a965976');
const l = await api('GET', '/desk/integrations/crm/links/f2e7a3dd-6803-4a18-bc25-4d31bf28e227');
return { module: m.s, moduleName: m.j?.data?.name, link: l.s, linkBody: l.t.slice(0, 300) };
