const o={};const a=await api('DELETE','/desk/channels/addresses/bc832879-1c56-4570-8ac6-fdba6026fe3e');o.addr=a.s+' '+String(a.t).slice(0,150);
const n=await api('DELETE','/desk/departments/8c6073ac-ba5f-4d17-9960-71a6850662a9');o.ntf=n.s+' '+String(n.t).slice(0,200);
const w=await api('DELETE','/desk/departments/bc53682c-7271-4fe0-8c32-99eff3a10bb1');o.wf=w.s+' '+JSON.stringify(w.j?.error?.details||w.t).slice(0,600);
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP desk: NTF address delete '+a.s+', NTF dept delete '+n.s+'\n');return o;
