const o={};
for(const [n,mod] of [['Leads',L],['Deals',D]]){ const bk=JSON.parse(fs.readFileSync(RUN+'/out/prefs-'+n+'-before-crm9.json','utf8')).data; const cur=(await api('GET','/modules/'+mod+'/list-preferences')).j.data;
 if(JSON.stringify(cur.prefs)===JSON.stringify(bk.prefs)){o[n]='unchanged lastView '+cur.prefs.lastView; continue;}
 const r=await api('PUT','/modules/'+mod+'/list-preferences',{prefs:bk.prefs,version:cur.version}); const a=(await api('GET','/modules/'+mod+'/list-preferences')).j.data; o[n]=SR(r)+' lastView now '+a.prefs.lastView+' same='+(JSON.stringify(a.prefs)===JSON.stringify(bk.prefs)); }
LED('restore list prefs (crm9) '+JSON.stringify(o)); return o;
