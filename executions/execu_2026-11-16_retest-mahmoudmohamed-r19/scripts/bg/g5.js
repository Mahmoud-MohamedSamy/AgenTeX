var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const led=fs.readFileSync(RUN+'/ledger.md','utf8').split('\n').filter(l=>/D2 parallel burst/.test(l));const o=[];
for(const l of led){const id=l.match(/[0-9a-f-]{36}/)[0];const raw=await recRaw(id);const d={};for(const x of raw.data||[])d[x.field]=x.value?.value;const dt=(await api('GET','/desk/tickets/'+id)).j?.data;const f=(await api('GET','/desk/tickets/'+id+'/activity')).j?.data||[];const h=(await api('GET','/desk/tickets/'+id+'/history')).j?.data||[];
o.push([String(d.subject).slice(-8),d.ticket_number,'rec '+raw.created_at.slice(11,19),'desk '+dt?.created_at?.slice(11,19),'lm '+raw.last_modified_at.slice(11,19),d.status,nm(d.owner),'act '+f.length+' '+f.map(e=>e.action).join('/'),'hist '+h.length]);}
return o;
