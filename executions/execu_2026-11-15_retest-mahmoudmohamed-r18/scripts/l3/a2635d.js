const o={}; const now=Date.now();
for(const f of ['','Overdue','Today','Tomorrow','Next7Days']){ const r=await api('GET','/desk/activities?per_page=200&limit=200'+(f?'&dueDate='+f:'')); const d=arr(r.j&&r.j.data); 
 const due=x=>x.due_date||x.dueDate||x.due_at||x.call_start_time||x.from_time||x.start_time; 
 o[f||'none']={s:r.s,n:d.length,meta:JSON.stringify(r.j&&r.j.meta).slice(0,160),qa:d.filter(x=>/QA RT18 2635/.test(x.subject||x.title||'')).map(x=>x.subject||x.title),keys:d[0]&&Object.keys(d[0]).join(',').slice(0,300),past:d.filter(x=>due(x)&&new Date(due(x))<now).length,future:d.filter(x=>due(x)&&new Date(due(x))>=now).length};
 if(r.s>=300) o[f].e=r.t.slice(0,200); }
return o;
