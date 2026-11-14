const o={};
for(const [name,mod,file] of [['Leads',L,'leads-prefs-before.json'],['Transactions','f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430','transactions-prefs-before.json']]){
 const bk=JSON.parse(fs.readFileSync(RUN+'/out/'+file,'utf8')).data; const cur=(await api('GET','/modules/'+mod+'/list-preferences')).j.data;
 let p=JSON.parse(JSON.stringify(bk.prefs)); const dead=[I.V07,I.V67];
 if(dead.includes(p.lastListViewId)) delete p.lastListViewId; if(Array.isArray(p.openListViewIds)) p.openListViewIds=p.openListViewIds.filter(x=>!dead.includes(x)); if(p.viewColumns) for(const d of dead) delete p.viewColumns[d];
 const same=JSON.stringify(cur.prefs)===JSON.stringify(p);
 if(!same){ const r=await api('PUT','/modules/'+mod+'/list-preferences',{prefs:p,version:cur.version}); o[name]=SR(r)+' lastView now '+(await api('GET','/modules/'+mod+'/list-preferences')).j.data.prefs.lastView; } else o[name]='unchanged';
}
LED('CLEANUP prefs '+JSON.stringify(o)); return o;
