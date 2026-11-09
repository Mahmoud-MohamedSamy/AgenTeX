const base=H+'/assets/';const idx=await (await ctx.request.get(base+'index-LdioPOXJ.js')).text();
const chunks=[...new Set([...idx.matchAll(/["'`]\.\/([\w\-.]+\.js)["'`]/g)].map(m=>m[1]))];const o={n:chunks.length,hits:[]};
const scan=(f,t)=>{for(const m of t.matchAll(/.{0,140}(?:reassign|backlog|bulk-assign|bulkAssign|transfer-tickets|tickets\/assign)[^]{0,140}/gi)){o.hits.push(f+' :: '+m[0].replace(/\s+/g,' ').slice(0,300));if(o.hits.length>60)return;}};
scan('index',idx);
for(const f of chunks){if(o.hits.length>60)break;let t='';try{t=await (await ctx.request.get(base+f)).text();}catch(e){continue;}scan(f,t);}
return o;
