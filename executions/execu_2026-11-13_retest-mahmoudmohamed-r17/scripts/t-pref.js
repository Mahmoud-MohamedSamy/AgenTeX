const r=await api('GET','/modules/'+L+'/list-preferences'); if(!fs.existsSync(RUN+'/out/leads-prefs-before.json')){fs.writeFileSync(RUN+'/out/leads-prefs-before.json',JSON.stringify(r.j,null,1)); LED('backup Leads list-preferences -> out/leads-prefs-before.json');}
return SR(r)+' '+r.t.slice(0,300);
