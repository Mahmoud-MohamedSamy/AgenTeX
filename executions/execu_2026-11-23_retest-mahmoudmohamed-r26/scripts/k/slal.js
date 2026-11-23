const ds=arr((await api('GET','/desk/departments?limit=100')).j);const o=[];
for(const d of ds){const p=arr((await api('GET','/desk/sla/policies?department_id='+d.id)).j);for(const x of p)o.push({dept:d.name,name:x.name,id:x.id,active:x.is_active,created:x.created_at,by:x.created_by,triggers:x.triggers,targets:(x.targets||[]).map(t=>({name:t.name,criteria:t.criteria,response:t.response,resolution:t.resolution,mode:t.calendar_mode,bh:t.business_hours_id,firstOnly:t.first_response_only}))});}
return o.sort((a,b)=>(b.created||'').localeCompare(a.created||'')).slice(0,6);
