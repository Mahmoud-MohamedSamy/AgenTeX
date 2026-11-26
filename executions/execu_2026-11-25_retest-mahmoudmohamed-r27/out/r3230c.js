const d = await api.O('DELETE', '/workflow/rules/' + ST.R3230); ledger('deleted rule QA RT27 3230 early (no conditions after editor test) ' + d.s);
const g = await api.O('GET', '/workflow/rules/' + ST.R3230); return { del: d.s, getAfter: g.s };
