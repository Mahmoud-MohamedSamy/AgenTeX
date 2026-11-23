const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const r = await api('GET', `/modules/${TK}/fields`); log(r.s, Object.keys(r.j || {}), JSON.stringify(r.j?.data).slice(0, 300));
const d = r.j?.data; const fl = Array.isArray(d) ? d : (d?.items || d?.fields || Object.values(d || {}).find(Array.isArray) || []);
log(fl.length, fl.filter(f => /department|team|support|plan|channel|priority|subject|contact|email/i.test((f.fieldName || '') + f.datatypeKey)).map(f => f.fieldName + ':' + f.datatypeKey).join(' '));
