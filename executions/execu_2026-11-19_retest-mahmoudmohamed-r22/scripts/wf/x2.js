eval(fs.readFileSync('wf/lib.js','utf8'));
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=s=>String(s).replace(/[0-9a-f-]{36}/g,m=>us.find(u=>u.userId===m)?.displayName||m.slice(0,8));
const ids=fs.readFileSync('../ledger.md','utf8').split('\n').filter(l=>/WF lane: ticket "QA RT20 WF 2997 (seq|mgrQAO)/.test(l)).map(l=>[l.match(/2997 (\w+ t\d)/)[1],l.match(/" ([0-9a-f-]{36})/)[1]]);
const o={};
for(const [k,id] of ids){const ex=await execsRaw(id);o[k]=ex.map(e=>U(`${e.evaluatedAt?.slice(11,19)} sync=${e.syncDurationMs} det=${JSON.stringify(e.details).slice(0,250)} | `+e.dispatches.map(d=>`${d.status} tgt=${JSON.stringify(d.target).slice(0,150)} resp=${d.responseStatus} body=${(d.responseBodyTruncated||'').slice(0,200)} done=${d.completedAt?.slice(11,19)}`).join(';')));
const f=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(f?.data)?f.data:(f?.data?.items||[]);o[k+' act']=L.map(x=>U((x.occurred_at||x.created_at||'').slice(11,19)+' '+x.action+' '+JSON.stringify(x.new_value||x.details||'').slice(0,80))).slice(0,8);}
return o;
