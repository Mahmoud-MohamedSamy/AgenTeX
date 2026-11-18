var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
await sleep(20000);
const h=(await api('GET','/modules/'+T+'/import/history')).j?.data||[];const o={sessions:[]};
for(const s of h.filter(x=>/^d3-/.test(x.file_name)).slice(0,2)){const d=(await api('GET','/modules/'+T+'/import/'+s.session_id)).j?.data;o.sessions.push({sid:s.session_id,file:d.file_name,status:d.status,created:d.created_count,error_count:d.error_count,errors:d.errors});}
const rows=(await allRows()).filter(r=>/QA RT19 BUG D3/.test(r.subject||''));o.recs=[];
for(const r of rows){made.tickets.push(r.id);LED('ticket created by import '+r.id+' "'+r.subject+'" (D3)');const f=await feed(r.id);o.recs.push([r.ticket_number,r.subject,nm(r.owner),f.map(e=>e.action).join('/')]);}saveMade();
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);o.tu1=L.find(x=>x.user_id===A1)?.name;
save('d3d.json',o);return o;
