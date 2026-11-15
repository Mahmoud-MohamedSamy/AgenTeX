eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1-ev.json','utf8'));const d=(await api('DELETE','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+M.contact)).s;
const left=async q=>{const s=(await api('GET','/modules/'+T+'/records?limit=50&search='+encodeURIComponent(q))).j?.data;const L=Array.isArray(s)?s:(s?.items||s?.records||[]);return L.filter(x=>JSON.stringify(x).includes(q)).length;};
const h=(await api('GET','/desk/happiness/settings')).j.data;const dep=(await api('GET','/desk/departments/'+DA)).j.data;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' E2E-1 evidence cleanup: contact '+d+', tickets/bp via pb-clean.\n');
return {contact:d,left:{evidence:await left('QA AO E1 evidence'),E1EV:await left(M.k)},happiness:h.is_enabled,deptVisibility:dep.visibility};
