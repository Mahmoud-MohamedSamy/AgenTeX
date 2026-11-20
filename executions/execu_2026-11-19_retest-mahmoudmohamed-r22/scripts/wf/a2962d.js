eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const W=h=>[{type:'Webhook',method:'POST',url:'https://qa-rt19.invalid/hook',bodyTemplate:'{}',headers:h,timeoutSeconds:5}];
const r=await mkRule('2962 ph',{kind:'RecordCreated'},W({'X-QA-Desc':'${description}','X-QA-Subj':'${subject}'}),{isActive:true});o.rule=r.res+' '+r.id;
if(!r.id)return o;
const ids=JSON.parse(fs.readFileSync('wf/out/2962-ids.json'));ids.ph=r.id;
const t1=await mkTicket('2962 ph',{description:'a\r\nInjected: 1'},'desc crlf');
const t2=await mkTicket('2962 ph',{description:'plain'},'subj crlf\r\nInjected: 2');
const t3=await mkTicket('2962 ph',{description:'plain control'},'control');
ids.t=[t1.id,t2.id,t3.id];fs.writeFileSync('wf/out/2962-ids.json',JSON.stringify(ids));
o.t=[t1,t2,t3];await sleep(30000);
for(const t of [t1,t2,t3]){const g=await getTicket(t.id);const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);o[t.id]={subj:JSON.stringify(g.subject),desc:JSON.stringify(g.description),ex:ex.map(e=>({out:e.outcome,err:e.errorMessage,d:e.dispatches.map(d=>[d.status,d.attempts,d.lastError,d.completedAt])}))};}
await deact(r.id);
save('2962d',o);return o;
