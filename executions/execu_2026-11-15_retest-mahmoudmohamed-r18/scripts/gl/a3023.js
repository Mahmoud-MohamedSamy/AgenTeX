const PM='95b45992-5beb-4f23-b619-e3ae0e304933', MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794', SA='ef8dc91f-1d30-491d-a1fc-9b62b96eca94'; const o={};
const sv=v=>({kind:'string',value:v});
const r=await api('POST','/modules/'+PM+'/records',{data:[{field:'product_name',value:sv('QA RT18 3023 Product two depts')},{field:'departments',value:{kind:'array',items:[sv(MK),sv(SA)]}}]});
o.two=r.s+' '+(r.j&&r.j.data&&r.j.data.id||r.t.slice(0,300)); const id=r.j&&r.j.data&&r.j.data.id;
if(id){ const g=await api('GET','/modules/'+PM+'/records/'+id); o.twoDeps=JSON.stringify(g.j.data.data.find(x=>x.field==='departments'));
 const u=await api('PATCH','/modules/'+PM+'/records/'+id,{data:[{field:'departments',value:{kind:'array',items:[sv(MK)]}}]}); o.patch=u.s;
 const g2=await api('GET','/modules/'+PM+'/records/'+id); o.after=JSON.stringify(g2.j.data.data.find(x=>x.field==='departments')); }
const b=await api('POST','/modules/'+PM+'/records',{data:[{field:'product_name',value:sv('QA RT18 3023 bad dept')},{field:'departments',value:{kind:'array',items:[sv('00000000-0000-0000-0000-000000000000')]}}]}); o.bad=b.s+' '+b.t.slice(0,250);
return o;
