const T='307cc0ce-bbc5-4507-ad7f-71370e8b93a0';const urls=new Set();
page.on('response',r=>{if(/locales\//.test(r.url()))urls.add(r.url());});
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&/repl|send|thread|mail|forward|draft|comment/i.test(u))return r.abort();return r.continue();});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.locator('button').filter({hasText:/Reply All/}).first().click({timeout:20000});await page.waitForTimeout(5000);
const out={urls:[...urls].map(u=>u.replace(H,''))};const hits={};
for(const u of urls){const t=await (await ctx.request.get(u)).text();const lines=[];const walk=(o,p)=>{if(typeof o==='string'){if(/send and|sendAnd|and set status|ticket (number|id) in (the )?subject|read receipt|delivered|strikethrough|inline image|spell|font family/i.test(p+' '+o))lines.push(p+' = '+o.slice(0,90));}else if(o&&typeof o==='object')for(const k in o)walk(o[k],p+'.'+k);};try{walk(JSON.parse(t),'');}catch(e){}if(lines.length)hits[u.replace(/.*locales\//,'')]=lines.slice(0,40);}
out.hits=hits;return out;
