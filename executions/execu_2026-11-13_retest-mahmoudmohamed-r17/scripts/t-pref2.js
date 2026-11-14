const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const r=await api('GET','/modules/'+D+'/list-preferences'); fs.writeFileSync(RUN+'/out/transactions-prefs-before.json',JSON.stringify(r.j,null,1)); LED('backup Transactions list-preferences -> out/transactions-prefs-before.json');
const o={prefs:r.s+' lastView='+(r.j&&r.j.data&&r.j.data.prefs&&r.j.data.prefs.lastView)};
const v = await api('GET','/modules/'+D+'/views?kind=kanban'); o.kanban = (v.j&&v.j.data&&v.j.data.views||[]).map(x=>x.name+':'+(x.settings&&x.settings.categorize_field));
for (const [n,id] of [['Transactions',D],['Leads',L],['Tasks','a9d87b62-b704-4c2e-b2d5-1b745d7c2065']]) { const a=await api('GET','/modules/'+id+'/records?page=1&per_page=20&skip_total=true'); const b=await api('GET','/modules/'+id+'/records?page=1&per_page=20'); o[n]='skip_total=true '+a.s+(a.s>=300?' '+a.t.slice(0,120):'')+' | without '+b.s; }
return o;
