const R={};const f=r=>{const o={id:r.id,ca:r.created_at||r.createdAt};for(const d of (r.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
for(let i=0;i<8;i++){
const x=await api('GET','/modules/'+TK+'/records?limit=15&sort_by=created_at&sort_order=desc');const L=Ls(x.j?.data).map(f);
R.newest=L.slice(0,8).map(o=>[o.ticket_number,MASK(o.subject||'').slice(0,60),o.channel,o.department===D?'D':String(o.department).slice(0,8),String(o.ca).slice(11,19)].join(' | '));
const hit=L.find(o=>/3000 ack|ack tes/i.test(o.subject||''));if(hit){R.hit=hit;break;}
if(i<7)await sleep(30000);}
const A=Ls((await api('GET','/desk/channels/addresses')).j?.data).find(a=>a.id===I.addr);R.addr={health:A?.receiving_health,paused:A?.fetch_paused_at,mail_state:A?.mail_state};
return R;
