eval(fs.readFileSync('sla/lib.js','utf8'));
const iso=ms=>new Date(ms).toISOString().slice(0,19)+'Z';const n=Date.now();
const B={overdue:iso(n-2*3600e3),none:null,in1h:iso(n+30*60e3),today:iso(n+4*3600e3),tomorrow:'2026-11-17T10:00:00Z',later:'2026-11-20T10:00:00Z',onhold:iso(n+3*3600e3)};
const R={};
for(const [k,d] of Object.entries(B)){const ex=[];if(d)ex.push(f('due_date',d));const t=await tk('2832 CD '+k,ex);
 if(k==='onhold'){const p=await api('PATCH','/modules/'+T+'/records/'+t.id,{data:[f('status','On Hold')]});R.holdPatch=p.s+' '+(p.s>=300?p.t.slice(0,200):'');}
 R[k]={id:t.id,set:d};}
await sleep(5000);
for(const k of Object.keys(B)){const g=(await api('GET','/modules/'+T+'/records/'+R[k].id)).j?.data;const v=Object.fromEntries((g?.data||[]).map(z=>[z.field,z.value?.value]));R[k].num=v.ticket_number;R[k].due=v.due_date;R[k].status=v.status;R[k].sla=v.sla_name;}
setCfg({c1:R});return R;
