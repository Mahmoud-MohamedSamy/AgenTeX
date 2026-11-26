const l = arr((await api('GET', `/workflow/rules?take=200&moduleId=${M.leads}`)).j?.data);
const act = l.filter(r => r.isActive || r.is_active || r.status === 'active');
const one = l.find(r => (r.name || '').length) || {};
const full = one.id ? (await api('GET', `/workflow/rules/${one.id}`)).j?.data : null;
return { total: l.length, active: act.map(r => r.name).slice(0, 15), keys: Object.keys(one), sample: JSON.stringify(full || one).slice(0, 2500) };
