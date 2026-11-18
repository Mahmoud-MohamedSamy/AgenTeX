const ms = arr((await api('GET', '/modules')).j.data);
const out = { keys: Object.keys(ms[0]), mods: ms.map(m => [m.id.slice(0, 8), m.apiName || m.api_name || m.singularLabel || m.label || m.pluralLabel || JSON.stringify(m).slice(0, 60)]) };
out.fieldsCur = [];
for (const m of ms) {
  const f = arr((await api('GET', '/modules/' + m.id + '/fields')).j.data);
  for (const x of f) { const s = JSON.stringify(x); if (/currenc|money|exchange/i.test(s)) out.fieldsCur.push([m.id.slice(0, 8), x.apiName || x.api_name || x.key, x.dataType || x.data_type || x.type, (x.label || '').slice(0, 30)]); }
}
return out;
