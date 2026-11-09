const lays = arr((await api('o', 'GET', `/modules/${T.TASKS}/layouts`)).j?.data).map(l => [l.name, l.id, l.isDefault ?? l.is_default]);
const f = arr((await api('o', 'GET', `/modules/${T.TASKS}/fields`)).j?.data).filter(x => /pick_list/.test(x.datatypeKey)).map(x => [x.apiName, (x.config?.allowed_values || []).slice(0, 8)]);
const bps = arr((await api('o', 'GET', `/modules/${T.TASKS}/blueprints`)).j?.data).map(b => [b.id, b.definition?.name || b.name, b.isActive, b.definition?.targetField]);
const lbps = arr((await api('o', 'GET', `/modules/${T.LEADS}/blueprints`)).j?.data).map(b => [b.id, b.definition?.name || b.name, b.isActive, b.definition?.targetField, JSON.stringify(b.definition?.entryCriteria)?.slice(0, 120)]);
const aps = arr((await api('o', 'GET', '/workflow/approval-processes')).j?.data).filter(a => a.isActive).map(a => [a.name, a.moduleId === T.TASKS ? 'tasks' : a.moduleId === T.LEADS ? 'leads' : a.moduleId?.slice(0, 8), a.executeOnCreate]);
return { lays, picklists: f, taskBlueprints: bps, leadBlueprints: lbps, activeApprovals: aps };
