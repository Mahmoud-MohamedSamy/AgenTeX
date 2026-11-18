const urls=[];page.on('response',r=>{if(/\.js(\?|$)/.test(r.url()))urls.push(r.url());});
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(3000);
log('hdr',(await page.getByRole('row').first().innerText()).replace(/\s+/g,' '));
const found=new Set();
for(const u of urls){try{const t=await (await page.request.get(u)).text();for(const m of t.matchAll(/["'`](\/[a-z\-\/:]*execution[a-z\-\/:]*)["'`]/gi))found.add(m[1]);for(const m of t.matchAll(/.{60}Execution History.{60}/g))found.add('TXT '+m[0]);}catch(e){}}
log('n',urls.length,JSON.stringify([...found].slice(0,30)));
return {};
