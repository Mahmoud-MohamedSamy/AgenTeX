const I=JSON.parse(fs.readFileSync(RUN+'/out/cleanup-inventory.json','utf8'));const o={t:[],topics:[],other:{}};
for(const x of I.del){const r=await api('DELETE','/modules/'+TK+'/records/'+x.id);o.t.push('#'+x.n+' '+r.s);}
for(const x of I.other.topics){const r=await api('DELETE','/desk/community/topics/'+x.id);o.topics.push(x.t+' '+r.s+(r.s>=300?' '+r.t.slice(0,120):''));}
let r=await api('DELETE','/workflow/custom-actions/ce1a9907-f037-4465-9148-b17c2e9fc33d');o.other.ca=E(r);
r=await api('DELETE','/workflow/custom-actions/sources/6043080b-a704-405f-9f60-ed6762b9b7aa');o.other.src=E(r);
r=await api('PATCH','/desk/departments/ff2611f5-4c5b-4cd2-8853-dd8767f401b6',{name:'QA RT26 VO Dept',agent_user_ids:[OWNER],view_only_agent_user_ids:[]});o.other.deptCES2=E(r);
await sleep(5000);
// purge recycle bin
let items=[],cur=null;for(let p=0;p<10;p++){const q=await api('GET','/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));const L2=arr(q.j?.data?.items||q.j?.data);items.push(...L2);cur=q.j?.meta?.next_cursor;if(!cur||!L2.length)break;}
const mine=items.filter(x=>/^(#\d+ )?(QA RT26|QA RT18 CA|New Question NDC-3007|QA RT22 3007|QA RT19 HC 3007|QA RT18 3007|test00)/.test(x.record_label||''));o.rbFound=mine.map(x=>x.record_label);
for(let i=0;i<mine.length;i+=25){const b=await api('POST','/audit/recycle-bin/delete',{ids:mine.slice(i,i+25).map(x=>x.id)});o['purge'+i]=E(b);}
fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z cleanup: '+JSON.stringify(o).slice(0,1500)+'\n');return o;
