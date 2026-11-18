var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
let L=[];let after='';for(let i=0;i<30;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(after?'&cursor='+after:''));L=L.concat(arr(r.j?.data));after=r.j?.meta?.next_cursor;if(!after)break;}
return L.filter(x=>/R19AS4|R19AS5|454[0-9]|455[0-9]/.test(x.record_label||'')).map(x=>[x.record_id.slice(0,8),x.record_label,x.deleted_at.slice(11,19)]);
