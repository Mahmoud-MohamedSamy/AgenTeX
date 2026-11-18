var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const o={};
const rows=(await allRows()).filter(r=>/R19ASIMP import/.test(r.subject||''));
o.recs=[];for(const r of rows){const raw=await recRaw(r.id);o.recs.push({id:r.id,n:r.ticket_number,subj:r.subject,owner:nm(r.owner),ownerId:r.owner,src:raw.source,cb:raw.created_by_name,feed:(await feed(r.id)).map(e=>e.action+' '+JSON.stringify(e.summary||{}).slice(0,200))});}
for(const p of ['/modules/'+T+'/import','/modules/'+T+'/imports','/modules/'+T+'/import/history','/modules/'+T+'/import/sessions','/imports?module_id='+T,'/data/imports','/modules/'+T+'/import?status=completed']){const r=await api('GET',p);o[p]=r.s+' '+r.t.slice(0,400);}
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);o.agentsNamed=L.filter(x=>/Mahmoud|Samy/i.test(x.name||x.display_name||x.full_name||'')).map(x=>({id:x.user_id,name:x.name||x.display_name||x.full_name}));o.agentKeys=Object.keys(L[0]||{});
o.deptA=(await api('GET','/desk/departments/'+DA)).t.slice(0,300);
const m=await api('GET','/desk/departments/'+DA+'/members');o.members=m.s+' '+JSON.stringify(arr(m.j?.data).map(x=>[x.user_id||x.id,x.name||x.display_name||x.full_name])).slice(0,800);
return o;
