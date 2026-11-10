const TECH='19510fdc-91f3-4a7a-8888-153f1318b765';const r=await api('GET','/desk/notification-rules/departments/'+TECH);
const d=r.j&&r.j.data;const rules=Array.isArray(d)?d:(d&&(d.rules||d.items))||[];
return {s:r.s,topKeys:d&&!Array.isArray(d)?Object.keys(d):'array',n:rules.length,ruleKeys:Object.keys(rules[0]||{}).join(','),sample:rules.slice(0,40).map(x=>[x.id&&x.id.slice(0,8),x.event||x.trigger||x.key||x.code,x.audience||x.recipient_type||x.recipients,x.channel||x.channels,x.enabled??x.is_enabled??x.active,x.is_system,x.name].join(' | ')),raw:JSON.stringify(rules[0]).slice(0,900)};
