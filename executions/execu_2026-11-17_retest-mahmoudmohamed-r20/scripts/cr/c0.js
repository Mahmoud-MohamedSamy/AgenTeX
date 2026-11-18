eval(fs.readFileSync('cr/lib.js','utf8'));const o={};const LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const f=arr((await api('GET',`/modules/e72e608a-a5d3-45cf-888a-dfadc6e8b456/fields?take=400`)).j?.data);o.callType=f.find(x=>x.apiName==='call_type')?.datatypeOptions;o.callsRel=f.find(x=>x.apiName==='related_to')?.datatypeOptions;
const lf=arr((await api('GET',`/modules/${LEADS}/fields?take=400`)).j?.data);o.leadFields=lf.filter(x=>/phone|description|company|email|last_name|single_line_3_9|first_name/.test(x.apiName)).map(x=>[x.apiName,x.labels?.en,x.datatypeKey,x.required]);
o.activeLeadRules=arr((await api('GET','/workflow/rules?take=300')).j?.data).filter(r=>r.isActive&&r.moduleId===LEADS).map(r=>[r.id,r.name,r.trigger?.kind,JSON.stringify(r.criteria).slice(0,200),r.actions.map(a=>a.type).join(',')]);
return o;
