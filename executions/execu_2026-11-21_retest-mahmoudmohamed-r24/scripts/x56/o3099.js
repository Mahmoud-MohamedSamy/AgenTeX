const T=JSON.parse(fs.readFileSync(RUN+'/out/3099.json','utf8'));const SALES='ef8dc91f-1d30-491d-a1fc-9b62b96eca94';const o={};
const fl=async()=>{const r=await api('GET','/desk/tickets/'+T.id+'/followers');return r.s+' '+JSON.stringify((r.j?.data?.items||r.j?.data||[]).map?.(x=>x.user_id===AG_A?'CES2':x.user_id===OWNER?'OWNER':(x.user_id||x.id||'').slice(0,8))||r.j?.data);};
o.before=await fl();
let r=await api('POST','/desk/tickets/'+T.id+'/move',{department_id:SALES});o.move=E(r);if(r.s>=300){r=await api('POST','/desk/tickets/'+T.id+'/move',{target_department_id:SALES});o.move2=E(r);}
await sleep(3000);o.dept=(await api('GET','/desk/tickets/'+T.id)).j?.data?.department_name;o.afterMove=await fl();
o.comment=(await api('POST','/desk/tickets/'+T.id+'/comments',{body_html:'<p>QA RT22 3099 comment after move</p>',is_public:false})).s;await sleep(4000);o.afterComment=await fl();
LED('3099: ticket #'+T.n+' moved to Sales');return o;
