const TM='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
for (const id of ['03472fb1-71c7-4ea6-8af8-75b63c8aa601','903409d6-04af-4aee-951c-a928d86c63f7']) { const r=await api('GET','/modules/'+TM+'/records/'+id); const d=r.j.data.data; o[id.slice(0,8)]=(d.find(x=>x.field==='priority')||{}).value; }
return o;
