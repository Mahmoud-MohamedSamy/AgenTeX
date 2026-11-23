eval(fs.readFileSync('wf/lib.js','utf8'));
const C='f7e488b5-0232-42fd-811c-1f24356af653',CL='fdb13486-6c74-4a80-8401-c9a25255dfe1',CT='349fc131-bdf7-44a3-94b2-78f01eb8d32e',CES1='2a7c1bc4-f6d4-4bd3-805e-0496ece13987';const o={};
const ts={kind:'timestamp',timestampValue:new Date(Date.now()+86400000).toISOString()};
const cr=m=>[{type:'CreateRecord',targetModuleId:C,targetLayoutId:CL,fieldMappings:m}];
o.onlyStart=(await mkRule('2968 only start',{kind:'RecordCreated'},cr({call_start_time:ts}))).res;
o.missingTwo=(await mkRule('2968 missing two',{kind:'RecordCreated'},cr({call_start_time:ts,subject:S('QA RT19 WF 2968 call')}))).res;
const full={call_start_time:ts,subject:S('QA RT19 WF 2968 call from ${subject}'),call_status:S('scheduled'),contact_id:S(CT),department:S('${department}')};
const r=await mkRule('2968 full',{kind:'RecordCreated'},cr(full),{isActive:true});o.full=r.res+' '+r.id;
if(!r.id){const full2={...full,department:S(D)};const r2=await mkRule('2968 full',{kind:'RecordCreated'},cr(full2),{isActive:true});o.full2=r2.res+' '+r2.id;r.id=r2.id;}
if(!r.id)return o;
const g=(await api('GET','/workflow/rules/'+r.id)).j?.data;o.storedMap=g?.actions?.[0]?.fieldMappings;
const t=await mkTicket('2968 full',{owner:CES1},'ticket owned by CES1');o.t=t;await sleep(25000);
const tk=await getTicket(t.id);o.ticketOwner=tk.owner;
const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);o.ex=ex.map(e=>({out:e.outcome,d:e.dispatches.map(d=>[d.actionType,d.status,d.lastError,d.target])}));
const calls=arr((await api('GET','/modules/'+C+'/records?take=10&search='+encodeURIComponent('QA RT19 WF 2968'))).j?.data);
o.calls=[];for(const c of calls){const x={};for(const f of c.data||[])x[f.field]=val(f.value);o.calls.push({id:c.id,ownerId:c.ownerId,createdBy:c.createdBy,createdByName:c.createdByName,...x});led(`call record ${c.id} (created by rule 2968 full)`);}
o.deact=await deact(r.id);
fs.writeFileSync(OUTD+'2968-ids.json',JSON.stringify({rule:r.id,t:t.id,calls:calls.map(c=>c.id)}));
save('2968',o);return o;
