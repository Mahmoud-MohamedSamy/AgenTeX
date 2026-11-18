eval(fs.readFileSync('wf/lib.js','utf8'));
const C='f7e488b5-0232-42fd-811c-1f24356af653',CL='fdb13486-6c74-4a80-8401-c9a25255dfe1',CT='349fc131-bdf7-44a3-94b2-78f01eb8d32e';const o={};
const ts={kind:'timestamp',timestampValue:new Date(Date.now()+86400000).toISOString()};
const m={call_start_time:ts,subject:S('${description}'),call_status:S('scheduled'),contact_id:S(CT),department:S('${department}')};
const r=await mkRule('2968 empty ph',{kind:'RecordCreated'},[{type:'CreateRecord',targetModuleId:C,targetLayoutId:CL,fieldMappings:m}],{isActive:true});o.rule=r.res+' '+r.id;if(!r.id)return o;
const before=new Set(arr((await api('GET','/modules/'+C+'/records?take=50&sort=-created_at')).j?.data).map(c=>c.id));
const t=await mkTicket('2968 empty ph',{},'no description');o.t=t;await sleep(25000);
o.ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id).map(e=>({out:e.outcome,d:e.dispatches.map(d=>[d.actionType,d.status,d.lastError])}));
const L=arr((await api('GET','/modules/'+C+'/records?take=50&sort=-created_at')).j?.data);
o.newCalls=[];for(const c of L){const x={};for(const f of c.data||[])x[f.field]=val(f.value);if(!before.has(c.id)&&(x.contact_id===CT)&&x.department===D){o.newCalls.push({id:c.id,...x});led(`call record ${c.id} (created by rule 2968 empty ph)`);}}
o.deact=await deact(r.id);save('2968b',o);return o;
