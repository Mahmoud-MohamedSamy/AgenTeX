const mid = await modId(); const lid = I.layout; const out = {};
const users = (await api('GET','/users?limit=5')).j; out.users = JSON.stringify(users).slice(0,300);
const F = await fieldsOf(mid); const o = F.find(f=>f.fieldName==='owner'); out.owner = o.datatypeKey + ' cap=' + JSON.stringify(o.capabilities);
return out;
