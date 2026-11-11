const B='4853562a-0b4d-45cb-ba34-9f2118fcd32c',ACC='784400e1-4a2a-42c2-b4f3-7ca56e79828a',CON='0924eb24-e42a-4eab-8efd-e3428f19e882';const j=JSON.parse(fs.readFileSync('../sl60.json','utf8'));const R={};
R.contract=(await api('DELETE','/modules/'+CON+'/records/'+j.con)).s;
const pl=(await api('GET','/desk/sla/support-plans?department_id='+B)).j?.data;const PL=Array.isArray(pl)?pl:(pl?.plans||pl?.items||[]);
for(const p of PL.filter(x=>/^QA AO SL60/.test(x.name)))R['plan '+p.name.slice(-4)]=(await api('DELETE','/desk/sla/support-plans/'+p.id)).s;
const po=(await api('GET','/desk/sla/policies?department_id='+B)).j?.data;const PO=Array.isArray(po)?po:(po?.policies||po?.items||[]);
for(const p of PO.filter(x=>/^QA AO SL60/.test(x.name)))R['policy '+p.name.slice(-4)]=(await api('DELETE','/desk/sla/policies/'+p.id)).s;
const ac=(await api('GET','/modules/'+ACC+'/records?page=1&page_size=100&search=QA%20AO%20SL60')).j?.data;const AL=Array.isArray(ac)?ac:(ac?.records||ac?.items||[]);
for(const a of AL){const n=(a.data||[]).find(x=>x.field==='account_name')?.value?.value||'';if(/^QA AO SL60 Account/.test(n))R['acct '+n.slice(-4)]=(await api('DELETE','/modules/'+ACC+'/records/'+a.id)).s;}
if(!R['acct '+j.u])R['acct '+j.u+' (by id)']=(await api('DELETE','/modules/'+ACC+'/records/'+j.acc)).s;
return R;
