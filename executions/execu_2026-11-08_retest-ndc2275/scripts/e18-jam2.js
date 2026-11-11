module.exports=async()=>{const R={};const AG={QT:'e82f62cb-9904-42c7-a13c-77a7449820b9',DT:'5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4'};
for(const [k,id] of Object.entries(AG)){const w=await api('GET','/desk/agents/'+id+'/workload');const D=(w.j&&w.j.data&&w.j.data.departments)||[];R[k]={total_open:D.reduce((a,x)=>a+(x.open_tickets||0),0),by_dept:D.filter(x=>x.open_tickets).map(x=>x.department_name+':'+x.open_tickets).join(', ')};}
return R;};
