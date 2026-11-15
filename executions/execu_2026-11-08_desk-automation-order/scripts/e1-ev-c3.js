const M=JSON.parse(fs.readFileSync('../e1-ev.json','utf8'));const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
const r=await api('POST','/desk/tickets/'+M.t3+'/blueprint-transitions/close',{run_id:uuid(),expected_state_id:'Open',fields:{}});return {me:(await api('GET','/iam/me')).j?.data?.display_name,c3:r.s+' '+(r.j?.error?.message||'')};
