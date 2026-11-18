const TM='88e8ea44-1658-4df3-9930-d0902b91073d', CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e', B='3445ec4a-020e-4f12-b156-dd2de7610164', C='9d182dfa-05f3-4af7-9685-8615a2fbe537';
const sv=v=>({kind:'string',value:v}); const o={};
for (const [n,own] of [['CS owned by C',C],['CS owned by B',B]]) { const r=await api('POST','/modules/'+TM+'/records',{data:[{field:'subject',value:sv('QA RT18 3045 '+n)},{field:'department',value:sv(CS)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-gl@example.com')},{field:'status',value:sv('Open')}]});
 const id=r.j&&r.j.data&&r.j.data.id; o[n]={c:r.s,id}; if(!id) continue;
 fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ticket "QA RT18 3045 ${n}" (Customer Support) ${id} (Desk)\n`);
 const a=await api('POST','/desk/tickets/'+id+'/assign',{owner_id:own}); o[n].assign=a.s+' '+a.t.slice(0,160);
}
return o;
