const o = {};
o.empty = E(await api.O('POST', '/desk/data/sandboxes', {}));
o.restoreAlt = E(await api.O('POST', `/desk/data/backups/${ST.BK}/restore`, {}));
return o;
