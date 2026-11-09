const base=H+'/assets/';const files=['TicketBulkDialogs-CZoCEb9j.js','bulk-actions-C1J5aKZK.js','BulkActionBar-CrmZglZ-.js','ticket-bulk-compose.mutations-DKa1RDzI.js'];
const o={};for(const f of files){const t=await (await ctx.request.get(base+f)).text();o[f]=[...new Set([...t.matchAll(/[`"']([^`"']*\/(?:desk|modules|tickets|agents|teams)[^`"']{0,90})[`"']/g)].map(m=>m[1]))].slice(0,40);
 o[f+' assign']=[...t.matchAll(/.{0,120}(?:assign|owner|team_id)[^]{0,120}/gi)].slice(0,6).map(m=>m[0].replace(/\s+/g,' ').slice(0,240));}
// also find agent offboarding / reassign chunks
await page.goto(H+'/',{waitUntil:'domcontentloaded',timeout:120000});await sleep(5000);
const main=await page.evaluate(()=>[...document.scripts].map(s=>s.src).filter(Boolean));let names=new Set();for(const u of main){const t=await (await ctx.request.get(u)).text();for(const m of t.matchAll(/assets\/([\w\-.]*(?:[Rr]eassign|[Oo]ffboard|[Dd]eactivat|[Tt]ransfer|Workload|AgentDetail|TeamDetail)[\w\-.]*\.js)/g))names.add(m[1]);}
o.chunks=[...names];
for(const f of [...names].slice(0,8)){const t=await (await ctx.request.get(base+f)).text();o['~'+f]=[...new Set([...t.matchAll(/[`"']([^`"']*\/(?:desk|tickets|agents|teams)\/[^`"']{0,90})[`"']/g)].map(m=>m[1]))].slice(0,25);}
return o;
