const out={};const C='https://staging-crm.taviportal.com';
const h=await (await ctx.request.get(C+'/',{timeout:60000})).text();
const js=[...h.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);out.js=js;
const seen=new Set();const hits=[];
const fetchJs=async u=>{if(seen.has(u)||seen.size>400)return'';seen.add(u);try{return await (await ctx.request.get(u.startsWith('http')?u:C+u,{timeout:60000})).text();}catch(e){return''}};
const queue=[...js];let n=0;
while(queue.length&&n<400){const u=queue.shift();const t=await fetchJs(u);n++;
 for(const m of t.matchAll(/["'](\/?assets\/[A-Za-z0-9_.-]+\.js)["']/g)){const p=m[1].startsWith('/')?m[1]:'/'+m[1];if(!seen.has(p))queue.push(p);}
 for(const re of [/.{0,160}recordVisibility.{0,160}/g,/.{0,120}reporting[_ ]?depth.{0,200}/gi,/.{0,100}public_read_only.{0,100}/g]){for(const m of t.matchAll(re)){if(hits.length<40)hits.push(u.split('/').pop()+': '+m[0]);}}}
out.files=n;out.hits=hits;return out;
