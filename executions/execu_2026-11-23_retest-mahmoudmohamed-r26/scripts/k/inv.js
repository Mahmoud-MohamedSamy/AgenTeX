const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const KEEP=new Set([...Object.values(X.t),'1ced98ce-cbb8-482b-8ca9-f8572628c223']);
const o={del:[],keep:[],other:{}};
const all=new Map();for(let p=1;p<=5;p++){const r=await api('GET','/modules/'+TK+'/records?page_size=100&page='+p);const L2=arr(r.j);for(const x of L2){const s=((x.data||[]).find(f=>f.field==='subject')||{}).value?.value||'';if(/^QA RT26|^New Question NDC-3007/.test(s))all.set(x.id,s);}if(L2.length<100)break;}
for(const id of made.tickets)if(!all.has(id)){const r=await rec(id);if(r.subject)all.set(id,r.subject);}
for(const [id,s] of all){const n=(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;(KEEP.has(id)?o.keep:o.del).push({id,n,s});}
const tp=arr((await api('GET','/desk/community/topics?limit=50')).j?.data?.items||(await api('GET','/desk/community/topics?limit=50')).j?.data);o.other.topics=tp.filter(x=>/NDC-3007|QA RT1[89]|QA RT22|test00/.test(x.title)).map(x=>({id:x.id,t:x.title,at:x.created_at.slice(0,10)}));
const ca=await api('GET','/desk/custom-actions/ce1a9907-f037-4465-9148-b17c2e9fc33d');o.other.customAction=ca.s+' '+(ca.j?.data?.name||'');
const wf=await api('GET','/modules/'+TK+'/workflow-rules/e1198023-3e92-47c3-a1e9-880f30006e73');o.other.wfRule=wf.s+' '+(wf.j?.data?.name||'');
const dd=(await api('GET','/desk/departments/'+X.DD)).j?.data;o.other.dept=dd?.name+' agents='+dd?.agent_user_ids?.length+' vo='+JSON.stringify(dd?.view_only_agent_user_ids);
const st=((await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[]);const b=JSON.parse(fs.readFileSync(RUN+'/out/statuses-before.json','utf8'));o.other.statusesSame=JSON.stringify(st)===JSON.stringify(b);
const rb=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');o.other.rb=arr(rb.j?.data?.items||rb.j?.data).filter(x=>/QA RT26|NDC-3007/.test(x.record_label||'')).map(x=>x.record_label);
fs.writeFileSync(RUN+'/out/cleanup-inventory.json',JSON.stringify(o,null,1));return o;
