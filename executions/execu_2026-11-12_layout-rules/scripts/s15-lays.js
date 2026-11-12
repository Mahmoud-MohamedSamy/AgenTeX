const mid = await modId(); const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data);
const deps = Object.fromEntries(arr((await api('GET', '/desk/departments')).j.data).map(d => [d.id, d.name]));
const out = []; for (const l of L) { const g = await getLayout(mid, l.id); out.push([l.name, l.id.slice(0, 8), (g.departmentIds || []).map(d => deps[d] || d.slice(0, 6)).join('+'), 'hc=' + g.displayInHelpCenter, 'def=' + (g.defaultDepartmentIds || []).map(d => deps[d] || d.slice(0, 6)).join('+')].join(' | ')); }
return out;
