for (const v of [[{value:'A1'}],[{label:'A1'}],[{display_value:'A1',actual_value:'a1'}],[{name:'A1'}]]) {
 const r = await api('POST','/global-sets',{name:'QA RT15 GS probe', values:v}); log(JSON.stringify(v), r.s, r.t.slice(0,700));
 if (r.s<300) { const id=r.j.data.id; log('get', (await api('GET','/global-sets/'+id)).t.slice(0,1500)); log('del', (await api('DELETE','/global-sets/'+id)).s); break; }
}
