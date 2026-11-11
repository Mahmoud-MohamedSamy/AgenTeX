// NDC-2814 (detached holiday list) via an RR rule, NDC-2812 (team assign with Team Assignment off) in QA AS6 Dept A. Cleans up list; restores TA.
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d',TEAM='434140a3-2145-428c-9e57-e6bc5cf2f8d0';const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));
const A1='876ce871-2b02-4854-89a7-68050391c62b',A2='d23fb4e0-248d-41f6-af60-d28885a7007e',A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const u=Math.random().toString(36).slice(2,6);const R={u};const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const today=new Date().toISOString().slice(0,10);
const hl=await api('POST','/desk/holiday-lists',{name:'QA AO HOL today '+u,description:null,is_active:true,category:'year_specific',business_hour_profile_id:null,detached:true,holidays:[{name:'QA AO today',start_date:today,end_date:null,occurrence:'year_specific'}]});
const HL=hl.j?.data?.id;R.list=hl.s+' detached='+(hl.j?.data?.business_hour_profile_id===null);
const rule=async(op,key)=>{const r=await api('POST','/desk/assignment-rules',{type:'round_robin',department_id:D,name:'QA AO 2814 '+op+' '+u,description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'description',operator:'contains',value:key},{field_key:'execution_time',operator:op,value:HL}],pattern:'1 and 2'},method:'sequential',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}]});if(r.j?.data?.id)m.rules.push(r.j.data.id);return r.s+(r.s>=300?' '+r.t.slice(0,200):'');};
R.ruleOn=await rule('on_holiday','AOHOLON'+u);R.ruleNot=await rule('not_on_holiday','AOHOLNOT'+u);
const tk=async k=>{const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO '+k),f('description','QA AO '+k),f('department',D),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;m.tickets.push(id);await sleep(5000);const v=((await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[]).find(x=>x.field==='owner')?.value?.value;return v?String(v).slice(0,8):'none';};
R['onHoliday(should assign)']=await tk('AOHOLON'+u);R['notOnHoliday(should stay unassigned)']=await tk('AOHOLNOT'+u);
// NDC-2812
const ta=(await api('GET','/desk/departments/'+D+'/team-assignment')).j?.data;R.taBefore=JSON.stringify(ta).slice(0,150);
const wasOn=ta?.enabled??ta?.is_enabled??ta?.team_assignment_enabled;
const key=Object.keys(ta||{}).find(k=>/enabled/.test(k));
if(wasOn){R.taOff=(await api('PUT','/desk/departments/'+D+'/team-assignment',{...ta,[key]:false})).s;}
const r2=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO 2812 '+u),f('description','QA AO 2812 '+u),f('department',D),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const t2=r2.j?.data?.id;m.tickets.push(t2);
const as=await api('POST','/desk/tickets/'+t2+'/assign',{owner_id:null,team_id:TEAM});R['NDC-2812 assign team with TA off']=as.s+' '+as.t.slice(0,160);
if(wasOn){R.taRestore=(await api('PUT','/desk/departments/'+D+'/team-assignment',ta)).s;}
R.listDelete=(await api('DELETE','/desk/holiday-lists/'+HL)).s;
fs.writeFileSync('../ar1-made.json',JSON.stringify(m));return R;
