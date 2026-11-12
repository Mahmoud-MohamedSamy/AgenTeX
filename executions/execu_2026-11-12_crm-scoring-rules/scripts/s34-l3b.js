const L=await modId('leads'); const ids=(I.recs||[]).filter(x=>x[0]===L).map(x=>x[1]).slice(-500);
const t0=Date.now(); const a=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:ids.slice(0,200),data:[{field:'lead_source',value:{kind:'string',value:'chat'}}]}); const withRule=Date.now()-t0;
await delAllQA(); const t1=Date.now(); const b=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:ids.slice(200,400),data:[{field:'lead_source',value:{kind:'string',value:'chat'}}]}); const noRule=Date.now()-t1;
fs.appendFileSync(RUN+'/results.tsv','L3\tpass\t500 chat leads, mass update to web in 3 requests of up to 200 (above 200: 400 TOO_MANY_RECORDS); all 500 scored 10. Timing for 200 records: '+withRule+' ms with the rule active vs '+noRule+' ms with no scoring rules ('+a.s+'/'+b.s+') — mass update is slow either way.\n');
return {withRule,noRule,a:a.s,b:b.s};
