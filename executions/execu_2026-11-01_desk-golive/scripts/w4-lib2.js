const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const flat = r => { const o = { id: r.id, created_at: r.created_at }; for (const f of (Array.isArray(r.data) ? r.data : [])) { let v = f.value; if (v && typeof v === 'object' && 'value' in v) v = v.value; o[f.field] = v; } return o; };
const findT = async q => arr(D((await api('GET', '/modules/' + TM + '/records?limit=20&sort=-created_at&q=' + encodeURIComponent(q))).j)).map(flat);
