const TM='88e8ea44-1658-4df3-9930-d0902b91073d', MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e', B='3445ec4a-020e-4f12-b156-dd2de7610164';
const sv=v=>({kind:'string',value:v}); const o={};
for (const n of ['B1','B2','ctrl']) { const r=await api('POST','/modules/'+TM+'/records',{data:[{field:'subject',value:sv('QA RT18 3045 '+n)},{field:'department',value:sv(MK)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-gl@example.com')},{field:'status',value:sv('Open')}]});
 const id=r.j&&r.j.data&&r.j.data.id; o[n]={c:r.s,id}; if(!id) continue;
 fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ticket "QA RT18 3045 ${n}" (Marketing) ${id} (Desk)\n`);
 if(n!=='ctrl'){ const a=await api('POST','/desk/tickets/'+id+'/assign',{owner_id:B}); o[n].assign=a.s+' '+a.t.slice(0,150); }
 const g=await api('GET','/modules/'+TM+'/records/'+id); const d=g.j.data.data; o[n].owner=(d.find(x=>x.field==='owner')||{}).value; o[n].num=(d.find(x=>x.field==='ticket_number')||{}).value;
}
return o;
