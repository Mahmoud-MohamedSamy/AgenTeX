const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')); const b={}; let ex='';
for(const id of I.T28){ const r=await api('PATCH','/modules/'+T+'/records/'+id,{data:[{field:'status',value:{kind:'string',value:'Open'}}]}); b[r.s]=(b[r.s]||0)+1; if(r.s>=300&&!ex) ex=r.t.slice(0,300); }
fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} QA RT18 3028 tickets set back to Open (PATCH) before bulk-close run 3 (Desk, lane 3)\n`);
return {b,ex};
