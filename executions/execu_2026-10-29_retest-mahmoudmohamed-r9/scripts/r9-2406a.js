// NDC-2406 read-only: Desk integration on Anyware — status, config (on_crm_delete), modules.
const st = await api('o', 'GET', 'desk:/desk/integrations/crm/status'); const cf = await api('o', 'GET', 'desk:/desk/integrations/crm/config');
const dm = arr((await api('o', 'GET', 'desk:/modules')).j?.data).map(m => [m.apiName || m.api_name || m.moduleKey, m.id]).filter(x => /contact|account|ticket/i.test(x[0]));
const cl = arr((await api('o', 'GET', `/modules/${T.CONTACTS}/layouts`)).j?.data).map(l => [l.name, l.id, l.isDefault ?? l.is_default]);
return { status: st.s + ' ' + st.t.slice(0, 500), config: cf.s + ' ' + cf.t.slice(0, 900), deskModules: dm, crmContactLayouts: cl };
