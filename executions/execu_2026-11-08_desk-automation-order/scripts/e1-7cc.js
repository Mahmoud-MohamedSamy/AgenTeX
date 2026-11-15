// As A2: normal close on c1, blueprint Close on c2.
const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
const a=await api('POST','/desk/tickets/'+M.c1+'/close',{});const b=await api('POST','/desk/tickets/'+M.c2+'/blueprint-transitions/close',{run_id:uuid(),expected_state_id:'Open',fields:{}});
return {me:(await api('GET','/iam/me')).j?.data?.display_name,c1:a.s,c2:b.s+' '+(b.j?.error?.message||''),at:new Date().toISOString()};
