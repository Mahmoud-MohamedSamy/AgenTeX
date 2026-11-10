const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d';const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));
const PS='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/presence/';
const N={'876ce871-2b02-4854-89a7-68050391c62b':'A1','d23fb4e0-248d-41f6-af60-d28885a7007e':'A2','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4':'A3','97be04b6-0a08-4883-aa51-e1650b11cab7':'creator'};
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const owner=async id=>{const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const v=d.find(x=>x.field==='owner')?.value?.value;return N[v]||(v?String(v).slice(0,8):'none');};
const tk=async(k,i)=>{const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO '+k+' '+i),f('description','QA AO '+k+' '+i),f('department',D),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;if(id)m.tickets.push(id);return id;};
const wl=async id=>{const r=(await api('GET','/desk/agents/'+id+'/workload')).j?.data;return r?(r.open??r.open_count??JSON.stringify(r).slice(0,80)):'?';};
const R={};
R.unassignedLater=await owner(m.tickets[0]);
R.workloadBefore={A1:await wl('876ce871-2b02-4854-89a7-68050391c62b'),A2:await wl('d23fb4e0-248d-41f6-af60-d28885a7007e'),A3:await wl('5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4')};
R.load=[];for(let i=1;i<=4;i++){const id=await tk('AOLOADdwbf',10+i);await sleep(4000);R.load.push(await owner(id));}
fs.writeFileSync(PS+'Mahmoud_Samy.txt','emailoff');await sleep(40000);
R.email2811=[];for(let i=1;i<=4;i++){const id=await tk('AOSEQdwbf',30+i);await sleep(4000);R.email2811.push(await owner(id));}
fs.writeFileSync(PS+'Mahmoud_Samy.txt','on');
fs.writeFileSync('../ar1-made.json',JSON.stringify(m));return R;
