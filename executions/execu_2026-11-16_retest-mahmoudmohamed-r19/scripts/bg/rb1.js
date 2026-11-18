var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
let L=[];let after='';for(let i=0;i<30;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(after?'&cursor='+after:''));L=L.concat(arr(r.j?.data));after=r.j?.meta?.next_cursor;if(!after)break;}
const hit=L.filter(x=>JSON.stringify(x).includes(AOB));
return {n:L.length,keys:Object.keys(L[0]||{}),hits:hit.map(x=>JSON.stringify(x).slice(0,700))};
