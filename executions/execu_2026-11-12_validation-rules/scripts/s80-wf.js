const o = {};
const L = await api('GET', '/web-forms?app=desk'); const f = arr(L.j && L.j.data)[0]; o.deskForm = JSON.stringify(f).slice(0, 2500);
const m = await api('GET', '/web-forms/modules?app=crm'); o.mods = JSON.stringify(m.j && m.j.data).slice(0, 600);
const lc = await api('GET', '/web-forms?app=crm'); o.crmList = SR(lc) + ' ' + JSON.stringify(lc.j && lc.j.data).slice(0, 300);
return o;
