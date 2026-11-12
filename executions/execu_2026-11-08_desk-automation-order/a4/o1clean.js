const L=arr2((await api('GET','/workflow/rules?take=300')).j?.data).filter(r=>/^QA AO WF O1/.test(r.name));const o={};
for(const r of L){o[r.name.slice(0,22)]=(await api('DELETE','/workflow/rules/'+r.id)).s;}
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' A4 O1 XSS payload rules deleted: '+JSON.stringify(o)+'\n');
const left=arr2((await api('GET','/workflow/rules?take=300')).j?.data).filter(r=>/onerror/.test(JSON.stringify(r))).length;return {o,leftWithPayload:left};
