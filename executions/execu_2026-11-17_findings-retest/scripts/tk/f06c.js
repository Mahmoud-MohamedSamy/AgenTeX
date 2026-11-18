await sleep(20000);
for(const id of C.f06){const r=await api('GET','/desk/sla/contracts/'+id+'/coverage');log(new Date().toISOString().slice(11,19),id.slice(0,8),r.s,'plan='+(r.j?.data?.plan?.name||'none'),'planDept?',JSON.stringify(r.j?.data).slice(0,400));}
