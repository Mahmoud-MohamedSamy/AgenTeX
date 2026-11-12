const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', A1='876ce871-2b02-4854-89a7-68050391c62b';
const o={};
o.prefs=await api('GET',`/desk/departments/${D}/round-robin-preferences`); o.prefs=[o.prefs.s,o.prefs.t.slice(0,800)];
o.wl=await api('GET',`/desk/agents/${A1}/workload`); o.wl=[o.wl.s,o.wl.t.slice(0,500)];
o.master=await api('GET',`/desk/assignment/notification-settings`); o.master=[o.master.s,o.master.t.slice(0,500)];
return o;
