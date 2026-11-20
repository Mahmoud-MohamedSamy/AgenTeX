eval(fs.readFileSync('wf/lib.js','utf8'));
const ids=fs.readFileSync('../ledger.md','utf8').split('\n').filter(l=>/WF lane: ticket "QA RT20 WF 2997 (mgrQAO|prQAO|ouCS)/.test(l)).map(l=>[l.match(/2997 (\w+) (t\d)/).slice(1).join(' '),l.match(/" ([0-9a-f-]{36})/)[1]]);
const o={};
for(const [k,id] of ids){const ex=await execsRaw(id);o[k]=ex.map(e=>({t:(e.startedAt||e.createdAt||e.firedAt||'').slice(11,19),trig:e.triggerKind||e.trigger,out:e.outcome,d:e.dispatches.map(d=>({st:d.status,res:JSON.stringify(d.result||d.output||d.details||'').slice(0,200),t:(d.completedAt||d.updatedAt||'').slice(11,19)}))}));if(!o.k)o.k=Object.keys(ex[0]||{}).join(',')+' | '+Object.keys(ex[0]?.dispatches?.[0]||{}).join(',');}
return o;
