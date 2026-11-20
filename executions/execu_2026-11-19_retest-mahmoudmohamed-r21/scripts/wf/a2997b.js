eval(fs.readFileSync('wf/lib.js','utf8'));
const ids=JSON.parse(fs.readFileSync(OUTD+'2997-ids.json'));const o={};
const dg=(await api('GET','/desk/departments/'+D)).j?.data;o.deptAgents=dg.agent_user_ids;
const u=arr((await api('GET','/iam/users?take=200')).j?.data).filter(x=>dg.agent_user_ids.includes(x.userId));o.users=u.map(x=>[x.displayName,x.status,x.orgUnitId,x.profileNames]);
const a=await api('POST',`/desk/tickets/${ids.ts[0]}/assign`,{owner_id:'2a7c1bc4-f6d4-4bd3-805e-0496ece13987'});o.manualCES1=a.s+' '+a.t.slice(0,200);
await sleep(1500);o.after=(await getTicket(ids.ts[0])).owner;
const a2=await api('POST',`/desk/tickets/${ids.ts[1]}/assign`,{owner_id:'876ce871-2b02-4854-89a7-68050391c62b'});o.manualTU1=a2.s+' '+a2.t.slice(0,200);
for(const p of ['/desk/agents/presence','/desk/departments/'+D+'/agents','/desk/agents/status']){const x=await api('GET',p);o[p]=x.s+' '+x.t.slice(0,500);}
return o;
