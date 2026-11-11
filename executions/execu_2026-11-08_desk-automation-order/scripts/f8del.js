const T='88e8ea44-1658-4df3-9930-d0902b91073d';const L=JSON.parse(fs.readFileSync('../f8-left2.json','utf8'));const R={};
for(const [id,num] of L)R['#'+num]=(await api('DELETE','/modules/'+T+'/records/'+id)).s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' F-08 leftovers deleted '+JSON.stringify(R)+'\n');return R;
