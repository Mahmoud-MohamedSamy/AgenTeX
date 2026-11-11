const j=JSON.parse(fs.readFileSync('../nt19t.json','utf8'));const T='88e8ea44-1658-4df3-9930-d0902b91073d';const R={};
for(const id of j.made.tickets)R[id.slice(0,8)]=(await api('DELETE','/modules/'+T+'/records/'+id)).s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-19 team tickets #2816/#2817 deleted '+JSON.stringify(R)+'\n');return R;
