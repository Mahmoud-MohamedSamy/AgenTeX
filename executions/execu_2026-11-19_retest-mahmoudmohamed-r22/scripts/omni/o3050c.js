const P='/salesiq/people/scoring/rules/eca8c296-88df-426c-bf47-d54abdfab945';const o={};const C={conditions:[{field:'pageurl',value:'qa-rt22-3050',operator:'CONTAINS',connector:'AND'}]};
const g=(await api('GET','/salesiq/people/scoring/rules')).j?.data;const cur=arr(g?.items||g).find(x=>x.id.startsWith('eca8c296'));o.xmin=cur?.xmin;
for(const [n,b] of [['patchEmpty',{criteria:{conditions:[]},xmin:cur?.xmin}],['patchZero',{points:0,xmin:cur?.xmin}]]){const r=await api('PATCH',P,b);o[n]=r.s+' '+String(r.t).slice(0,180);}
const after=arr((await api('GET','/salesiq/people/scoring/rules')).j?.data).find(x=>x.id.startsWith('eca8c296'));o.after='points='+after?.points+' conds='+after?.criteria?.conditions?.length+' enabled='+after?.enabled;return o;
