async (page) => { EVAL
const b=await z('GET','/api/v1/recycleBin?limit=50');const L=(b.j?.data||[]);const mine=L.filter(x=>/QA RT20 AZ/.test(JSON.stringify(x)));const o={binTotal:L.length,mine:mine.length};
if(mine.length){const r=await z('POST','/api/v1/recycleBin/delete',{ids:mine.map(x=>x.id)});o.del=r.s+' '+r.t.slice(0,150);}
const b2=await z('GET','/api/v1/recycleBin?limit=50');o.mineAfter=(b2.j?.data||[]).filter(x=>/QA RT20 AZ/.test(JSON.stringify(x))).length;
o.search=(await z('GET','/api/v1/tickets/search?subject='+encodeURIComponent('QA RT20 AZ*')+'&limit=50')).s;
o.skills=((await z('GET','/api/v1/skills?departmentId=1499272000000432293')).j?.data||[]).filter(x=>/QA RT20/.test(x.name)).length;
o.types=((await z('GET','/api/v1/skillTypes?departmentId=1499272000000432293')).j?.data||[]).filter(x=>/QA RT20/.test(x.name)).length;return o;}
