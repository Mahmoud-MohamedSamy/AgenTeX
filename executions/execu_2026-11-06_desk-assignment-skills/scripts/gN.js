// 7 Nov G-05: department "new ticket" notification to Dept A agents
eval(require('fs').readFileSync('lib.js','utf8'));
const DO='../out/agent-do.json';const RESF='../out/agent-do-result.json';
const agentGet=async(who,p)=>{const id='g05'+Date.now()+who;fs.writeFileSync(DO,JSON.stringify([{id,who,m:'GET',p}]));for(let i=0;i<30;i++){await sleep(1000);const f='../out/do-'+id+'.json';if(fs.existsSync(f))return JSON.parse(fs.readFileSync(f,'utf8'));}return null;};
const o={};const K='department.ticket_created';
const before=(await api('GET','/desk/notification-rules/departments/'+IDS.DA)).j.data.rules.find(r=>r.key===K);o.before={on:before.is_enabled,email:before.email_enabled,mobile:before.mobile_enabled};
o.on=sh(await api('PUT','/desk/notification-rules/departments/'+IDS.DA+'/rules/'+K,{is_enabled:true}));LED('G-05: Dept A department.ticket_created ON temporarily');
const sub='QA AS6 G05 new ticket alert';const t=await mkTicket(sub,IDS.DA,{},'G-05');await sleep(12000);
o.owner=(await own(t.id)).owner||null;
for(const w of ['a1','a2','a3']){const n=await agentGet(w,'/notifications?limit=15');const L=(n&&n.data&&(n.data.data||n.data))||[];o[w]=(Array.isArray(L)?L:[]).filter(x=>JSON.stringify(x).includes('G05')).map(x=>(x.event_type||'')+' | '+(x.title||'')+' | '+String(x.body||'').slice(0,80));}
const on=await api('GET','/notifications?limit=15');o.ownerSelf=arr(on.j.data&&(on.j.data.data||on.j.data)).filter(x=>JSON.stringify(x).includes('G05')).map(x=>(x.event_type||'')+' | '+(x.title||''));
o.off=sh(await api('PUT','/desk/notification-rules/departments/'+IDS.DA+'/rules/'+K,{is_enabled:before.is_enabled})).s;LED('G-05: Dept A department.ticket_created restored');
return o;
