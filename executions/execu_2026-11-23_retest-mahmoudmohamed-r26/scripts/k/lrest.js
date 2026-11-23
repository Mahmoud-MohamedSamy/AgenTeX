const M='/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/list-preferences';const cur=(await api('GET',M)).j?.data;
const prefs={...cur.prefs,lastView:'kanban'};const r=await api('PUT',M,{prefs,version:cur.version});
const now=(await api('GET',M)).j?.data;return {put:r.s+' '+r.t.slice(0,150),lastView:now.prefs.lastView,version:now.version};
