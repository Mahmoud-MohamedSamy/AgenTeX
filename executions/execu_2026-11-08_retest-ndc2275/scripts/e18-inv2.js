module.exports=async()=>{const R={};
 const f=await api('GET','/modules/'+T+'/fields');const d=f.j&&f.j.data;const F=arr(d&&(d.fields||d));R.fieldShape=Array.isArray(d)?'array':Object.keys(d||{}).join(',');R.fieldSample=F.slice(0,2);
 R.fieldKeys=F.map(x=>(x.api_name||x.key||x.field_key||x.name)+':'+(x.type||x.data_type||'')+(x.is_system||x.system?'*':'')).join(' ');
 const L=[];for(let p=1;p<=2;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=asc');const A=arr(r.j.data);if(!A.length)break;L.push(...A.map(fl));}
 R.upTo12Oct=L.filter(o=>String(o.created_at)<'2026-10-12').map(o=>({no:o.ticket_number,c:String(o.created_at).slice(0,16),s:String(o.subject||'').slice(0,30),st:o.status,dept:String(o.department||'').slice(0,8),own:o.owner?String(o.owner.id||o.owner).slice(0,8):null}));
 const t1=L[0];R.t1id=t1.id;
 for(const p of ['/desk/tickets/'+t1.id+'/activity','/desk/tickets/'+t1.id+'/threads','/desk/tickets/'+t1.id+'/conversations','/desk/tickets/'+t1.id+'/replies','/desk/tickets/'+t1.id]){const r=await api('GET',p);R[p.replace(t1.id,'{id}')]=r.s+' '+r.t.slice(0,350);}
 return R;};
