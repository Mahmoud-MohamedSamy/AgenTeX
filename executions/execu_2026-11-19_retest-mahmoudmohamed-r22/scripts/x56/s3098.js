const o={};const a=await mkT('3098','owned by owner',{owner:OWNER});const b=await mkT('3098','unassigned',{});const c=await mkT('3098','owned by CES2',{owner:AG_A});const d=await mkT('3098','owned by CES1',{owner:AG_B});
await sleep(3000);const N=async id=>(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;
const T={a:{id:a,n:await N(a)},b:{id:b,n:await N(b)},c:{id:c,n:await N(c)},d:{id:d,n:await N(d)}};fs.writeFileSync(RUN+'/out/3098.json',JSON.stringify(T));
const g=await api('GET','/desk/agents/'+AG_A);o.agentGet=g.s+' '+JSON.stringify(g.j?.data||g.j).slice(0,500);return {T,o};
