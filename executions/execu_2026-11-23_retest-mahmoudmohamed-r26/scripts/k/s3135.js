const V=JSON.parse(fs.readFileSync(RUN+'/scripts/k/vo.json','utf8'));const DD=V.DD;
const st=(await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[];fs.writeFileSync(RUN+'/out/statuses-before.json',JSON.stringify(st,null,1));
const ty=Object.fromEntries(st.map(s=>[s.value,s.type]));
const closedT=st.filter(s=>s.type==='closed').map(s=>s.value), holdT=st.filter(s=>s.type==='on_hold').map(s=>s.value), openT=st.filter(s=>s.type==='open').map(s=>s.value);
log('types', {closed:closedT.length,hold:holdT.length,open:openT.length});
const wl=async()=>(((await api('GET','/desk/agents/'+OWNER+'/workload')).j?.data?.departments||[]).find(d=>d.department_id===DD)||{}).open_tickets;
const ids=[];for(let i=1;i<=6;i++){ids.push(await mkT('st','S'+i,{owner:OWNER},DD));}
await sleep(5000);const o={wl0:await wl(),moves:[],bad:[]};
const seq=[closedT[1]||closedT[0], holdT[0], openT[3]||openT[0], 'Closed', 'Open', closedT[closedT.length-1], openT[openT.length-1]];
for(const s of seq){for(const id of ids){const r=await api('PATCH','/modules/'+TK+'/records/'+id,{data:fields({status:s})});o.moves.push({s,code:r.s});}
 await sleep(4000);
 for(const id of ids){const rv=(await rec(id)).status;const d=(await api('GET','/desk/tickets/'+id)).j?.data||{};const ok=rv===s&&d.status===s&&((ty[s]==='closed')===!!d.closed_at);if(!ok)o.bad.push({id:id.slice(0,8),want:s,rec:rv,desk:d.status,closed_at:d.closed_at});}
 o['wl_after_'+s]=await wl();}
fs.writeFileSync(RUN+'/out/3135.json',JSON.stringify({ids,seq,ty:seq.map(s=>ty[s]),...o},null,1));
return {seq:seq.map(s=>s+':'+ty[s]),codes:[...new Set(o.moves.map(m=>m.code))],n:o.moves.length,bad:o.bad,wl:Object.fromEntries(Object.entries(o).filter(([k])=>k.startsWith('wl')))};
