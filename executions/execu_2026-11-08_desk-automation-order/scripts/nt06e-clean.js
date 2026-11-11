const S=JSON.parse(fs.readFileSync('../nt06e.json','utf8'));const R={};
R.ticket=(await api('DELETE','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+S.ticket)).s;R.contact=(await api('DELETE','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+S.contact)).s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-06 edit cleanup #'+S.num+' '+JSON.stringify(R)+'\n');return R;
