const P='/salesiq/people/scoring/rules';const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z OMNI: '+m+'\n');
const keep=r=>{if(r.s<300){const id=r.j?.data?.id||r.j?.id;if(id)LED('3050 scoring rule created '+id+' (delete)');}return r.s+' '+String(r.t).slice(0,260);};
o.list=(await api('GET',P)).s;
o.nameOnly=keep(await api('POST',P,{name:'QA RT22 3050 name only'}));
o.empty=keep(await api('POST',P,{}));
o.zeroPointsWithCond=keep(await api('POST',P,{name:'QA RT22 3050 zero pts',points:0,conditions:[{field:'email',operator:'is_not_empty'}]}));
o.condsEmptyPoints5=keep(await api('POST',P,{name:'QA RT22 3050 no cond',points:5,conditions:[]}));
return o;
