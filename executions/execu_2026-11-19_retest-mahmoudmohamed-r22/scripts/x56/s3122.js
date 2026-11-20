const D='6edaf8a3-7e99-4213-bd90-451802d63be6';const d=(await api('GET','/desk/departments/'+D)).j?.data;const ag=(d.agent_user_ids||[]).filter(x=>x!==OWNER);
const o={deptName:d.name,ownerIsAgent:(d.agent_user_ids||[]).includes(OWNER),agents:ag.length};if(!ag.length)return o;
const id=await mkT('3122','clone source',{owner:ag[0]},D);await sleep(3000);const t=(await api('GET','/desk/tickets/'+id)).j?.data;o.src={id,n:t?.ticket_number,owner:(await rec(id)).owner};
fs.writeFileSync(RUN+'/out/3122.json',JSON.stringify(o));return o;
