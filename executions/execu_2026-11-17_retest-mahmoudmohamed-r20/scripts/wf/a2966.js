eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const hs=(await api('GET','/desk/happiness/settings')).j.data;o.now={on:hs.is_enabled,scoped:hs.department_scope_enabled,depts:hs.department_ids};
if(hs.is_enabled)return {err:'happiness is ON now, other lane?',...o};
const CT='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const r=await mkRule('2966',{kind:'RecordCreated'},[{type:'SendHappinessEmail'}],{isActive:true,departmentIds:[D]});o.rule=r.res+' '+r.id;if(!r.id){o.raw=r.r.t.slice(0,300);return o;}
const t=await mkTicket('2966',{contact_id:CT},'ratings off');o.t=t;await sleep(20000);
const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);o.ex=ex.map(e=>({out:e.outcome,d:e.dispatches.map(d=>[d.actionType,d.status,d.lastError,d.target])}));
const h=await api('GET',`/desk/tickets/${t.id}/history`);o.hist=arr(h.j?.data).map(x=>x.action+':'+(x.field_key||'')).slice(0,10);
fs.writeFileSync(OUTD+'2966-ids.json',JSON.stringify({rule:r.id,t:t.id}));
save('2966',o);return o;
