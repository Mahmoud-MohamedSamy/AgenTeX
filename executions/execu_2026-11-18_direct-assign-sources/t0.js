const n = (await api('GET', '/desk/assignment/notification-settings')).j?.data;
log({ notif: n });
const L = (await api('GET', '/desk/assignment-rules?type=direct')).j?.data?.rules || [];
log({ direct_rules: L.length, active: L.filter(r => r.is_active).map(r => r.name) });
const deps = (await api('GET', '/desk/departments')).j?.data; const D = Array.isArray(deps) ? deps : (deps?.departments || deps?.items || []);
log({ deptB: D.filter(d => /QA AO Dept B/.test(d.name)).map(d => d.id + ' ' + d.name) });
