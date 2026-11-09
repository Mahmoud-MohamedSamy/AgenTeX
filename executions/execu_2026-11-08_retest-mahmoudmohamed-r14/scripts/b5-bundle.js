const base=H+'/assets/';const o={};
const a=await (await ctx.request.get(base+'AgentsPage-DGSb953i.js')).text();
const i=a.indexOf('function N(');o.N=i>=0?a.slice(i,i+900):'nf';const k=a.indexOf('=>`/desk/agen');o.V=a.slice(k-50,k+200);
for(const m of a.matchAll(/function [A-Za-z]{1,2}\(e,t,n\)\{[^]{0,700}/g)){if(/department/.test(m[0]))o['fn_'+m[0].slice(9,12)]=m[0].slice(0,700);}
const idx=await (await ctx.request.get(base+'index-LdioPOXJ.js')).text();const j=idx.search(/\$z=`/);o.z=idx.slice(j,j+60);
const t=await (await ctx.request.get(base+'TeamDetailPage-DItEHP3g.js')).text();o.team=[...t.matchAll(/.{0,200}deleteTeam[^]{0,300}/g)].slice(0,2).map(m=>m[0]);
const b=await (await ctx.request.get(base+'TicketBulkDialogs-CZoCEb9j.js')).text();o.bulk=[...b.matchAll(/.{0,250}bulkAssign[^]{0,300}/g)].slice(0,2).map(m=>m[0]);
if(!o.bulk.length){for(const f of ['ticket-bulk-compose.mutations-DKa1RDzI.js','useTicketOwnership-yzmwgYSI.js']){const x=await (await ctx.request.get(base+f)).text();o['bulk_'+f]=[...x.matchAll(/.{0,250}bulkAssign[^]{0,300}/g)].slice(0,2).map(m=>m[0]);}}
return o;
