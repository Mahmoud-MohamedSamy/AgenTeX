const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
for(const p of ['/sla/reapply','/sla/apply','/sla']){const r=await api('POST','/desk/tickets/'+X.t.C1+p,{});o[p]=E(r);if(r.s<300)break;}
await sleep(3000);o.after=(await api('GET','/desk/tickets/'+X.t.C1+'/sla')).t.slice(0,300);return o;
