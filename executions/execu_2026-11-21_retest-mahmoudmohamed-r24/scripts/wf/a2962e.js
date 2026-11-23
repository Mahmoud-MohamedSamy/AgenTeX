eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const U='https://staging-desk.taviportal.com/api/v1/qa-rt19-probe';
const W=h=>[{type:'Webhook',method:'POST',url:U,bodyTemplate:'{}',headers:h,timeoutSeconds:10}];
const cases=[['2962 rc',{'Authorization':'Bearer qa-rt19-bogus'},'plain'],['2962 re',{'Authorization':'${description}'},'Bearer qa-rt19-bogus'],['2962 rj',{'X-QA-Desc':'${description}'},'a\r\nAuthorization: Bearer qa-rt19-bogus'],['2962 rn',{'X-QA-Desc':'${description}'},'plain no auth']];
const made=[];
for(const [tag,h,desc] of cases){const r=await mkRule(tag,{kind:'RecordCreated'},W(h),{isActive:true});o[tag]={rule:r.res+' '+r.id};if(!r.id)continue;const t=await mkTicket(tag,{description:desc},'ticket');o[tag].t=t.id;made.push([tag,r.id,t.id]);}
await sleep(30000);
for(const [tag,rid,tid] of made){const ex=(await execsRaw(tid)).filter(e=>e.ruleId===rid);o[tag].ex=ex.map(e=>({out:e.outcome,err:e.errorMessage,d:e.dispatches.map(d=>({st:d.status,att:d.attempts,err:d.lastError,code:d.responseStatus,body:(d.responseBodyTruncated||'').slice(0,200)}))}));o[tag].deact=await deact(rid);}
save('2962e',o);return o;
