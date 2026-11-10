// A3 regression in QA AS6 Dept A: sequential, load, Email-channel-off (NDC-2811). New QA AO rules on description, create+update; deleted at end.
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d';
const A1='876ce871-2b02-4854-89a7-68050391c62b',A2='d23fb4e0-248d-41f6-af60-d28885a7007e',A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const N={[A1]:'A1',[A2]:'A2',[A3]:'A3'};const PS='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/presence/';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6);const R={u};const made={rules:[],tickets:[]};
const rule=async(name,method,key)=>{const r=await api('POST','/desk/assignment-rules',{type:'round_robin',department_id:D,name:'QA AO '+name+' '+u,description:'QA',is_active:true,execute_on:['create','update'],targets:[{criteria:{conditions:[{field_key:'description',operator:'contains',value:key}],pattern:null},method,pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}]});if(r.j?.data?.id)made.rules.push(r.j.data.id);return r.s+(r.s>=300?' '+r.t.slice(0,250):'');};
const tk=async(key,i)=>{const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO '+key+' '+i),f('description','QA AO '+key+' '+i),f('department',D),f('status','Open'),f('priority','high')]});const id=r.j?.data?.id;if(id)made.tickets.push(id);return id;};
const owner=async id=>{const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const o=d.find(x=>x.field==='owner');const v=o?.value?.value;const k=typeof v==='object'&&v?v.id:v;return N[k]||(k?String(k).slice(0,8):'none');};
const presence=async()=>{const ag=(await api('GET','/desk/queues/agents')).j?.data;const AL=Array.isArray(ag)?ag:(ag?.agents||[]);return AL.filter(a=>N[a.user_id]).map(a=>N[a.user_id]+':'+(a.presence?.online?'on':'off')+'/email '+a.presence?.channels?.email).join(' ');};
try{
 R.presence=await presence();
 const kS='AOSEQ'+u,kL='AOLOAD'+u;
 R.ruleSeq=await rule('RR seq','sequential',kS);R.ruleLoad=await rule('RR load','load',kL);
 R.seq=[];for(let i=1;i<=6;i++){const id=await tk(kS,i);await sleep(4000);R.seq.push(await owner(id));}
 R.load=[];for(let i=1;i<=3;i++){const id=await tk(kL,i);await sleep(4000);R.load.push(await owner(id));}
 // NDC-2811: A2 Email channel off
 fs.writeFileSync(PS+'Mahmoud_Samy.txt','emailoff');await sleep(45000);R.presence2811=await presence();
 R.seqEmailOffA2=[];for(let i=7;i<=12;i++){const id=await tk(kS,i);await sleep(4000);R.seqEmailOffA2.push(await owner(id));}
 R.feed2811=(JSON.stringify((await api('GET','/desk/tickets/'+made.tickets[made.tickets.length-1]+'/activity')).j).match(/"action":"assign[^}]{0,300}/g)||[]).slice(0,2);
 fs.writeFileSync(PS+'Mahmoud_Samy.txt','on');
}catch(e){R.error=e.message;}
fs.writeFileSync('../ar1-made.json',JSON.stringify(made));
return R;
