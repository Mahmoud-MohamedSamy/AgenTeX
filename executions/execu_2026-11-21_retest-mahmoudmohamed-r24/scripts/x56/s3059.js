const DD='6d68dc90-7ecf-4829-bf51-9beb87282b87';const o={};
const g0=(await api('GET','/desk/departments/'+DD)).j?.data;o.before={agents:g0.agent_user_ids.length,vo:g0.view_only_agent_user_ids};
fs.writeFileSync(RUN+'/out/dd-before.json',JSON.stringify({name:g0.name,agent_user_ids:g0.agent_user_ids,view_only_agent_user_ids:g0.view_only_agent_user_ids}));
let r=await api('PATCH','/desk/departments/'+DD,{name:g0.name,agent_user_ids:[OWNER,AG_A],view_only_agent_user_ids:[AG_A]});o.setVO=E(r);LED('3059: CES2 view-only member of '+g0.name+' (restore from out/dd-before.json)');
const id=await mkT('3059','vo ticket',{priority:'low'},DD);await sleep(3000);const n=(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;
const id2=await mkT('3059','vo closed',{priority:'low'},DD);await sleep(2000);o.close2=E(await api('POST','/desk/tickets/'+id2+'/close',{}));const n2=(await api('GET','/desk/tickets/'+id2)).j?.data?.ticket_number;
fs.writeFileSync(RUN+'/out/3059.json',JSON.stringify({id,n,id2,n2}));o.t=[n,n2];return o;
