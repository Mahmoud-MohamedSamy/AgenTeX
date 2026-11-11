const T='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4';const d=JSON.parse(fs.readFileSync('../d14w.json','utf8'));const R={};
for(const id of d.tickets)R['t'+id.slice(0,6)]=(await api('DELETE','/modules/'+T+'/records/'+id)).s;
const l=await api('GET','/modules/'+C+'/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc');
for(const x of (l.j?.data||[])){const e=x.data.find(f=>f.field==='email')?.value?.value;if(e==='qa.ao.d14web@example.net')R['c'+x.id.slice(0,6)]=(await api('DELETE','/modules/'+C+'/records/'+x.id)).s;}
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' D-14 web cleanup '+JSON.stringify(R)+'\n');return R;
