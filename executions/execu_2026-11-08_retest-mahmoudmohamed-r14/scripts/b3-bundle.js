const base=H+'/assets/';const out={};
for(const f of ['index-LdioPOXJ.js','useTicketOwnership-yzmwgYSI.js','AssignToMenu-BSXaUyMe.js','TeamDetailPage-DItEHP3g.js']){const t=await (await ctx.request.get(base+f)).text();
 out[f]=[...new Set([...t.matchAll(/`[^`]{0,40}\/(?:desk|tickets|agents|teams)[^`]{0,100}`/g)].map(m=>m[0]).filter(s=>/assign|owner|team|agent|transfer|backlog/i.test(s)))].slice(0,60);}
return out;
