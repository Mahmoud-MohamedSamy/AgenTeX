const mgr = arr((await api('GET', '/iam/profiles/11111111-1111-1111-1111-111111111102/permissions')).j?.data).map(x => x.permissionKey);
const rules = arr((await api('GET', `/workflow/rules?take=200&moduleId=${M.leads}`)).j?.data).filter(r => /QA TIA/.test(r.name || '')).length;
const leads = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=5&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA' }]))}`)).j?.data).length;
return { crmManager: { n: mgr.length, tia: mgr.includes('ai:tia:use') }, qaTiaRules: rules, qaTiaLeads: leads };
