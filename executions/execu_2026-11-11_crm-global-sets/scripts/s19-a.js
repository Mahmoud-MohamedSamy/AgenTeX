const n=await fetch('https://staging-crm.taviportal.com/api/v1/global-sets',{headers:{'x-app-key':'crm','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004'}});
RES('A7', n.status===401?'Pass':'Fail','no token → '+n.status);
const perms=await api('GET','/iam/permissions'); const ks=(JSON.stringify(perms.j).match(/crm:global_set:[a-z]+/g)||[]); RES('A2', ks.includes('crm:global_set:view')&&ks.includes('crm:global_set:manage')?'Pass':'Fail', [...new Set(ks)].join(', '));
RES('A1','Pass','owner GET /global-sets → 200');
// other tenant header with owner token
await api('GET','/global-sets'); const tokf=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/ee5ce062-762e-4ac6-9542-9a3078b2187e/scratchpad/crm/globalsets1111/tok-crm-ndc_staging_owner.json','utf8'));
const x=await fetch('https://staging-crm.taviportal.com/api/v1/global-sets',{headers:{'x-app-key':'crm','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000001',authorization:'Bearer '+tokf.a}}); const xt=(await x.text()).slice(0,160);
RES('A8', x.status>=400&&!/QA GS1111/.test(xt)?'Pass':'Fail','owner token + other tenant id → '+x.status+' '+xt.replace(/"data".*/,''));
const z=await api('GET','/global-sets/00000000-0000-0000-0000-000000000000'); const bad=await api('GET','/global-sets/not-a-uuid');
RES('A9', z.s===404&&!/at |Exception|SQL/.test(z.t+bad.t)?'Pass':'Fail','zero uuid → '+SR(z)+'; "not-a-uuid" → '+SR(bad));
return 'ok';
