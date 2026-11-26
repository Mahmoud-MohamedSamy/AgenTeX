const o = {};
const b = await api.O('GET', '/desk/data/backups'); o.backups = b.s + ' ' + b.t.slice(0, 1500);
const s = await api.O('GET', '/desk/data/sandboxes'); o.sandboxes = s.s + ' ' + s.t.slice(0, 800);
const v = await api.O('POST', '/desk/data/backups', {}); o.createEmpty = E(v);
return o;
