module.exports=async()=>{const R={};const q=await api('GET','/desk/queues/agents');const d=arr((await api('GET','/desk/departments')).j.data);const nm=Object.fromEntries(d.map(x=>[x.id,x.name]));
 for(const n of ['QA Team 1','Mahmoud TAVIPortal','Customer Experience Specialists 1','Customer Experience Specialists 2'])R[n]=((q.j.data.agents||[]).find(x=>x.name===n)||{department_ids:[]}).department_ids.map(i=>nm[i]||i).join(', ');
 for(const p of ['/desk/teams','/desk/teams?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158','/iam/teams']){const r=await api('GET',p);R[p]=r.s+' '+JSON.stringify(arr(r.j&&r.j.data).map(t=>t.name+':'+(t.department_id||'').slice(0,8)+':'+t.id.slice(0,8))).slice(0,500);}
 return R;};
