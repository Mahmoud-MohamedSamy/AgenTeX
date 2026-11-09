const out={};const r=await api('GET','/iam/users');const d=arr(r.j);
out.n=d.length;out.zero=d.filter(x=>/^0{8}-/.test(x.userId)).length;out.distinct=new Set(d.map(x=>x.userId)).size;out.status=d.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{});out.anonymized=d.filter(x=>x.anonymized).length;
for(const p of ['/desk/agents','/desk/agents?page=2','/iam/users/search?q=a','/iam/invitations','/desk/agents/count']){const x=await api('GET',p);out[p]={s:x.s,len:arr(x.j).length,meta:x.j&&x.j.meta,tot:x.j&&(x.j.total||x.j.totalCount)}}
await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/settings/users/agents',{waitUntil:'load',timeout:120000}).catch(()=>{});await page.waitForTimeout(10000);
out.agUrl=page.url();const t=await page.locator('body').innerText();out.ag=t.slice(t.lastIndexOf('Email Providers')+15).replace(/\n+/g,' | ').slice(0,800);
await page.screenshot({path:'evidence/raw/agents.png'});
return out;
