const me=(await api('GET','/iam/me')).j.data;const myId=String(me.user_id);
const deps=arr((await api('GET','/desk/departments')).j);const name=id=>{const d=deps.find(x=>String(x.id)===String(id));return d?d.name:(id?'?'+String(id).slice(0,6):'(none)')};
const mine=new Set(deps.filter(x=>(x.agent_user_ids||[]).map(String).includes(myId)).map(x=>String(x.id)));
const M={Tasks:'d120a6c2-2596-4254-968b-a1bcd3a000bf',Calls:'f7e488b5-0232-42fd-811c-1f24356af653',Events:'6fb19115-9356-40f0-b064-840d8f1fad93'};
const out={};const v=(r,f)=>{const x=(r.data||[]).find(z=>z.field===f);return x&&x.value&&x.value.value};
let sample=null;
for(const [k,id] of Object.entries(M)){const r=await api('GET',`/modules/${id}/records?pageSize=100`);const recs=arr(r.j);const g={};let outside=0,none=0;for(const x of recs){const d=v(x,'department');if(!d){none++;continue}g[name(d)]=(g[name(d)]||0)+1;if(!mine.has(String(d))){outside++;if(!sample&&v(x,'ticket_id'))sample={mod:k,id:x.id,dept:name(d),ticket:v(x,'ticket_id')};}}out[k]={n:recs.length,noDept:none,outsideMyDepts:outside,byDept:g};}
if(sample){const t=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+sample.ticket);const a=await api('GET',`/modules/${M[sample.mod]}/records/${sample.id}`);sample.ticketGet=t.s;sample.activityGet=a.s;sample.id=sample.id.slice(0,8);sample.ticket=String(sample.ticket).slice(0,8);}
out.sample=sample;return out;
