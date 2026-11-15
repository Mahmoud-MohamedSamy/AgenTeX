// Run blueprint transition 'next' on the E2E-2 ticket as the signed-in agent (A2 = old owner, A3 = new owner).
const M=JSON.parse(fs.readFileSync('../pc3.json','utf8'));const me=(await api('GET','/iam/me')).j?.data?.display_name;
const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
const r=await api('POST','/desk/tickets/'+M.t2+'/blueprint-transitions/next',{run_id:uuid(),expected_state_id:'Open',fields:{}});
return {me,run:r.s+' '+(r.j?.error?.code||'')+' '+(r.j?.error?.message||'').slice(0,120)};
