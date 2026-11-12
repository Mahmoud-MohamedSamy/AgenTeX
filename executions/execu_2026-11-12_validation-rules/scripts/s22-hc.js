const r = await api('GET', '/help-centers'); const hcs = arr(r.j && r.j.data); const out = { n: hcs.length, hcs: hcs.map(h => [h.id, h.name, h.help_center_key || h.key, h.status, JSON.stringify(h.department_ids || h.departmentIds || '').slice(0, 120)]) };
const key = hcs[0] && (hcs[0].help_center_key || hcs[0].key);
if (key) for (const p of ['/help-center/public/' + key + '/forms', '/help-center/public/' + key, '/help-center/public/' + key + '/departments']) { const x = await api('GET', p); out[p] = x.s + ' ' + x.t.replace(/"(api_key|token|secret)[^,]*/gi, '').slice(0, 700); }
return out;
