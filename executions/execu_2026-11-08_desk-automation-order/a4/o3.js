// O3 SSRF: webhook URLs pointing at internal / metadata addresses. Record save result and, if saved, the dispatch result (error text must not leak internal data).
const urls={dnsLocal:'http://localtest.me/',decimal:'http://2130706433/',ipv6:'http://[::1]/'};const o={};
for(const [k,u] of Object.entries(urls)){const r=await mkRule('O3'+k,{kind:'RecordCreated'},[{type:'Webhook',url:u,method:'POST',timeoutSeconds:5,bodyTemplate:'{"t":"${subject}"}',headers:{}}]);o[k]={save:r.s+(r.err?' '+r.err.slice(0,150):'')};
 if(r.id){const t=await mkTicket('O3'+k);o[k].t=t.id;}}
await sleep(40000);
for(const [k,v] of Object.entries(o)){if(!v.t)continue;const ex=arr2((await api('GET','/workflow/executions?recordId='+v.t)).j?.data).filter(e=>e.outcome==='Fired');v.disp=ex.flatMap(e=>(e.dispatches||[]).map(d=>d.status+' http='+d.responseStatus+' err='+String(d.lastError||'').slice(0,160)));delete v.t;}
return o;
