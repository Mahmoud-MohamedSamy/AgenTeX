await api('GET','/global-sets'); const tokf=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/ee5ce062-762e-4ac6-9542-9a3078b2187e/scratchpad/crm/globalsets1111/tok-crm-ndc_staging_owner.json','utf8'));
const out={}; for (const t of ['a7a7a7a7-0000-0000-0000-000000000001','a7a7a7a7-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111']) { const x=await fetch('https://staging-crm.taviportal.com/api/v1/global-sets',{headers:{'x-app-key':'crm','x-tenant-id':t,authorization:'Bearer '+tokf.a}}); const j=await x.json().catch(()=>null); const names=arr(j&&j.data).map(s=>s.name); out[t]=x.status+' count '+names.length+' ours '+names.filter(n=>/QA GS1111|QA RT15/.test(n)).length; }
const own=arr((await api('GET','/global-sets')).j.data).length; out.own=own;
const ok=Object.entries(out).filter(([k])=>k!=='own').every(([k,v])=>!/^200/.test(v)||new RegExp('count '+own+' ours').test(v));
RES('A8', ok?'Pass':'Fail','owner token with another x-tenant-id: '+JSON.stringify(out)+(ok?' — header ignored, the token\'s own tenant data is returned (no leak)':''));
return out;
