const S=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/sl18p.json','utf8'));const M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4',HC='e74f2abb-e28d-400e-908c-f2c54862e389',ACC='130fd3fd-04ed-4ba8-8f04-c84e62220f0f';const R={};
for(const k of ['on','off']){R['t'+k]=(await api('DELETE','/modules/'+M+'/records/'+S.t[k].ticket)).s;R['p'+k]=(await api('DELETE','/desk/sla/policies/'+S.t[k].policy)).s;}
R.hcAccount=(await api('DELETE','/help-centers/'+HC+'/accounts/'+ACC)).s;
R.contact=(await api('DELETE','/modules/'+C+'/records/'+S.contact)).s;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-18 portal cleanup '+JSON.stringify(R)+'\n');return R;
