await page.goto(H+'/',{waitUntil:'domcontentloaded',timeout:120000});await sleep(8000);
const srcs=await page.evaluate(()=>[...document.scripts].map(s=>s.src).filter(Boolean));
const hits=new Set();const seen=new Set();const q=[...srcs];
while(q.length&&seen.size<80){const u=q.shift();if(seen.has(u))continue;seen.add(u);let t='';try{t=await (await ctx.request.get(u)).text();}catch(e){continue;}
 for(const m of t.matchAll(/["'`]([^"'`]*(?:reassign|bulk|transfer)[^"'`]{0,80})["'`]/gi))if(m[1].includes('/'))hits.add(m[1].slice(0,140));
 for(const m of t.matchAll(/["'`](\.?\.?\/?[\w\-\/.]*assets\/[\w\-.]+\.js)["'`]/g)){try{q.push(new URL(m[1],u).href);}catch(e){}}}
return {scripts:seen.size,hits:[...hits].slice(0,80)};
