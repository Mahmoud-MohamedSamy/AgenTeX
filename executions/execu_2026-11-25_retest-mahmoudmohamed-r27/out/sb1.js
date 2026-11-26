const o = {}; const A = as('ndc-staging-owner');
const mods = arr((await A('GET', '/modules')).j?.data); o.modules = mods.length;
const tk = mods.find(m => m.moduleKey === 'desk_tickets'); const ct = mods.find(m => m.moduleKey === 'desk_contacts');
const cnt = async m => { if (!m) return 'n/a'; const r = await A('GET', `/modules/${m.id}/records?page_size=100`); return r.s + ' n=' + arr(r.j?.data).length + ' ' + arr(r.j?.data).slice(0, 4).map(x => (x.data || []).find(f => /subject|name|last_name/.test(f.field))?.value?.value).join(' | '); };
o.tickets = await cnt(tk); o.contacts = await cnt(ct);
o.depts = arr((await A('GET', '/desk/departments?limit=200')).j?.data?.departments || (await A('GET', '/desk/departments?limit=200')).j?.data).map(d => d.name).slice(0, 10);
return o;
