const d = await api('GET', '/desk/departments/' + CS);
const s = JSON.stringify(d.j?.data || {}).replace(/[\w.+-]+@[\w.-]+/g, '<mail>');
return { s: d.s, keys: Object.keys(d.j?.data || {}), body: s.slice(0, 2500) };
