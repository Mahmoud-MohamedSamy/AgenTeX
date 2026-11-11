const out={};for(const [n,id] of [['Tech','19510fdc-91f3-4a7a-8888-153f1318b765'],['QA AO Dept A','93949fbd-f9df-4e2e-ae45-00b8dc38385b']]){
 const d=await api('GET','/desk/departments/'+id);const ar=await api('GET','/desk/assignment-rules?department_id='+id);const L=ar.j?.data;const a=Array.isArray(L)?L:(L?.items||L?.rules||[]);
 const ta=await api('GET','/desk/departments/'+id+'/team-assignment');
 out[n]={dept:d.s,name:d.j?.data?.name,active:d.j?.data?.is_active,rules:a.map(x=>[x.name,x.kind||x.type,x.is_active??x.enabled].join('|')),team:JSON.stringify(ta.j?.data).slice(0,120)};}
const s=await api('GET','/desk/assignment/notification-settings');out.switches=s.j?.data;return out;
