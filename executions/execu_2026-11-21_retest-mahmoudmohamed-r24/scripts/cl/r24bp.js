const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const o={};
const rl=await api('GET','/desk/assignment-rules?department_id=4853562a-0b4d-45cb-ba34-9f2118fcd32c');o.ruleList=rl.s;
const all=arr(rl.j?.data).concat(arr(rl.j?.data?.rules));const mine=all.filter(r=>/QA RT24/.test(r.name||''));o.rulesFound=mine.map(r=>r.name);
for(const r of mine)o['rule '+r.name]=(await api('DELETE','/desk/assignment-rules/'+r.id)).s;
const g=await api('GET','/desk/assignment-rules/db05d8b9');o.ruleShort=g.s;
for(let k=0;k<12;k++){const bps=arr((await api('GET','/modules/'+TK+'/blueprints')).j?.data).filter(b=>/QA RT24/.test(b.name||''));if(!bps.length){o.bpLeft=0;break;}
 let busy=0;for(const b of bps){const r=await api('DELETE','/modules/'+TK+'/blueprints/'+b.id);o['bp '+b.name]=r.s;if(r.s===409)busy++;}if(!busy){o.bpLeft=0;break;}await sleep(15000);}
return o;
