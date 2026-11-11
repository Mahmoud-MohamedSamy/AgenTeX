const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out={};
const v = await api('GET','/modules/'+D+'/views?kind=kanban'); out.kanban = (v.j&&v.j.data&&v.j.data.views||[]).map(x=>x.name+':'+x.id+':'+(x.settings&&x.settings.categorize_field));
for (const [n,id] of [['Transactions',D],['Leads','841043e1-c078-41f9-8d6e-dfd61bee45c3'],['Tasks','a9d87b62-b704-4c2e-b2d5-1b745d7c2065']]) {
  const a = await api('GET','/modules/'+id+'/records?page=1&per_page=20&skip_total=true'); const b = await api('GET','/modules/'+id+'/records?page=1&per_page=20');
  out[n] = 'skip_total=true '+a.s+(a.s>=300?' '+a.t.slice(0,120):'')+' | without '+b.s;
}
return out;
