const TK='88e8ea44-1658-4df3-9930-d0902b91073d'; const out=[];
for(let p=1;p<=2;p++){ const r=await api('GET',`/modules/${TK}/records?page=${p}&page_size=100`); const rs=r.j?.data||[];
 for(const x of rs){ const d=x.data||[]; const g=n=>(d.find(y=>y.field===n)||{}).value?.value; const s=g('subject')||''; if(/QA SK12/.test(s)) out.push([x.id,g('ticket_number'),s.slice(0,30)]); } }
return out;
