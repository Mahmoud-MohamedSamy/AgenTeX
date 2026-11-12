const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const o={};
o.prefs=await api('PUT',`/desk/skill-preferences?department_id=${D}`,{auto_add:true,placement:'bottom'}); o.prefs=[o.prefs.s,o.prefs.t.slice(0,200)];
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const r=await api('POST',`/modules/${TK}/records`,{data:[f('subject','QA SK12 order2 QASK12S1 QASK12S2 QASK12S3 QASK12Inact'),f('department',D),f('status','Open')]});
const id=r.j?.data?.id; track('ticket',id,'QA SK12 order2'); o.id=id;
await sleep(7000);
const g=await api('GET',`/modules/${TK}/records/${id}`); o.skills=(g.j.data.data.find(x=>x.field==='skills')||{}).value;
return o;
