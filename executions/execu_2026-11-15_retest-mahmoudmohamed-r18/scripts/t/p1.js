const o={};
for(const [n,id] of [['Leads',L],['Deals',D]]){ const r=await api('GET','/modules/'+id+'/list-preferences'); const f=RUN+'/out/prefs-'+n+'-before-crm9.json'; if(!fs.existsSync(f)){fs.writeFileSync(f,JSON.stringify(r.j,null,1)); LED('backup '+n+' list-preferences -> out/prefs-'+n+'-before-crm9.json (crm9 lane)');} o[n+'pref']=r.s+' lastView='+(r.j&&r.j.data&&r.j.data.prefs&&r.j.data.prefs.lastView);
 const a=await api('GET','/modules/'+id+'/records?page=1&per_page=20&skip_total=true'); const b=await api('GET','/modules/'+id+'/records?page=1&per_page=20'); o[n]='skip_total '+a.s+(a.s>=300?' '+a.t.slice(0,150):'')+' | without '+b.s;
 const fl=encodeURIComponent(JSON.stringify([{field:n=='Leads'?'lead_status':'stage',operator:'equals',value:'x'}]));
 const c=await api('GET','/modules/'+id+'/records?page=1&per_page=25&filters='+fl); o[n+'filter']=c.s+' '+(c.s>=300?c.t.slice(0,150):'');
 const v=await api('GET','/modules/'+id+'/views?kind=kanban'); o[n+'kanban']=(v.j&&v.j.data&&v.j.data.views||[]).map(x=>x.name+':'+(x.settings&&x.settings.categorize_field)+':'+x.id);
}
return o;
