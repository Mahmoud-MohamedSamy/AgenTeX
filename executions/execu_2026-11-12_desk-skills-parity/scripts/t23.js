const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d', T='81b2c9de-b75c-412b-ad6a-eab6c787de82';
const o={};
const s4=await api('POST',`/desk/skills?department_id=${D}`,{name:'QA SK12 S4',type_id:T,is_active:true,criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QASK12S4NONE'}],pattern:null}});
// at 29/30 active? 
o.s4=[s4.s,s4.j?.data?.id||s4.t.slice(0,200)]; if(s4.j?.data?.id) track('skill',s4.j.data.id,'QA SK12 S4');
const f=(k,v)=>({field:k,value:{kind:'string',value:v}}); const sk=n=>({field:'skills',value:{kind:'array',items:n.map(x=>({kind:'string',value:x}))}});
const r=await api('POST',`/modules/${TK}/records`,{data:[f('subject','QA SK12 E1 QASK12RR'),f('department',D),f('status','Open'),{field:'owner',value:{kind:'null'}},sk(['QA SK12 S4','QA SK12 S1'])]});
o.e1=r.j?.data?.id; track('ticket',o.e1,'QA SK12 E1 QASK12RR');
await sleep(12000); const d=(await api('GET',`/modules/${TK}/records/${o.e1}`)).j.data.data; o.owner=(d.find(x=>x.field==='owner')||{}).value; o.num=(d.find(x=>x.field==='ticket_number')||{}).value?.value;
return o;
