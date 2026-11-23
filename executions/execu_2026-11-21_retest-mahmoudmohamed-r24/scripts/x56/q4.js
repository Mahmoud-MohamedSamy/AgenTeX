const r1=await runT('5c68004d-860c-4bcd-b6b8-77e0bce5c044','end','Escalated');const r2=await runT('9ec8bdc5-2362-4386-a4cd-e5bee332d0c7','admin','Open');
const t=await api('GET',`/modules/${TK}/records/5c68004d-860c-4bcd-b6b8-77e0bce5c044/blueprint-transitions`);
return {end:r1.s+' '+JSON.stringify(r1.j?.error||{}).slice(0,300),admin:r2.s+' '+JSON.stringify(r2.j?.error||{}).slice(0,300),offered5117:t.s+' '+JSON.stringify(t.j?.data).slice(0,200)};
