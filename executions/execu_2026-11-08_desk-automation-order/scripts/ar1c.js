const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d';const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));
const N={'876ce871-2b02-4854-89a7-68050391c62b':'A1','d23fb4e0-248d-41f6-af60-d28885a7007e':'A2','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4':'A3','97be04b6-0a08-4883-aa51-e1650b11cab7':'creator'};
const rules=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+D)).j?.data?.rules||[];const key=JSON.stringify(rules.find(r=>/QA AO RR seq/.test(r.name))?.targets?.[0]?.criteria?.conditions?.[0]?.value);
const kS=JSON.parse(key);const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const owner=async id=>{const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const v=d.find(x=>x.field==='owner')?.value?.value;return N[v]||(v?String(v).slice(0,8):'none');};
const R={key:kS,nullOwner:[],form:[]};
for(let i=21;i<=24;i++){const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO '+kS+' '+i),f('description','QA AO '+kS+' '+i),f('department',D),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;if(id)m.tickets.push(id);else{R.err=r.s+' '+r.t.slice(0,200);break;}await sleep(4000);R.nullOwner.push(await owner(id));}
// Unassign one of the earlier creator-owned tickets: that is an update event, RR should assign it
const t0=m.tickets[0];R.unassign=(await api('POST','/desk/tickets/'+t0+'/assign',{owner_id:null,team_id:null})).s;await sleep(5000);R.afterUnassign=await owner(t0);
fs.writeFileSync('../ar1-made.json',JSON.stringify(m));return R;
