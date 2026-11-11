const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const I=JSON.parse(fs.readFileSync(RUN+'/out/2810-ids.json','utf8')); const since = process.env.SINCE || I.deletedAt.slice(0,16);
await sleep(Number(process.env.WAIT||45000));
let all=[]; for (let p=1;p<=5;p++){ const r=await api('GET','/desk/integrations/crm/failures?page_size=100&page='+p); const a=arr(r.j&&r.j.data); all=all.concat(a); if(a.length<100) break; }
const mine = all.filter(f=>[I.A.id,I.A.crm,I.B.id,I.B.crm].includes(f.record_id));
const newer = all.filter(f=>(f.failed_at||'')>=since);
let links=[]; for (let p=1;p<=10;p++){ const r=await api('GET','/desk/integrations/crm/links?page_size=100&page='+p); const a=arr(r.j&&r.j.data); links=links.concat(a); if(a.length<100) break; }
const la = links.find(l=>l.desk_record_id===I.A.id), lb = links.find(l=>l.desk_record_id===I.B.id);
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const deskB = await api('GET','/modules/'+CT+'/records/'+I.B.id);
return {totalFailures:all.length, mine: mine.map(f=>({kind:f.kind,code:f.error_code,err:f.last_error,status:f.status,park:f.park_reason,dir:f.direction,at:f.failed_at})), newerThanDelete:newer.length, linkA: la?{status:la.sync_status,attn:la.needs_attention}:'gone', linkB: lb?{status:lb.sync_status,attn:lb.needs_attention}:'gone', deskB_after_crm_delete: deskB.s};
