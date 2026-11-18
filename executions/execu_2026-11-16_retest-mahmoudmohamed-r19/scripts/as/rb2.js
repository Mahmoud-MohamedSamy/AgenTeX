var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';
const g=await api('GET','/modules/'+T+'/records/7e106cc1-1303-4988-a7ee-a864b9898ec1');
const items=[];let cur=null;for(let i=0;i<30;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));const L=arr(r.j?.data);items.push(...L);cur=r.j?.meta?.next_cursor;if(!cur||!L.length)break;}
const tks=items.filter(x=>x.module_key==='desk_tickets');save('rb-items.json',tks);
return {getDeleted:g.s+' '+g.t.slice(0,200),total:items.length,tickets:tks.length,uniq:new Set(tks.map(x=>x.record_id)).size,aoLabels:tks.filter(x=>/AO|AS6/.test(x.record_label)).length};
