eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const R={};
const h=(await api('GET','/desk/happiness/settings')).j?.data;R.happiness=h?{enabled:h.is_enabled,scoped:h.department_scope_enabled,depts:h.department_ids,trigger:h.trigger}:null;
const n=await api('GET','/desk/notifications/rules?audience=contact');R.nrS=n.s;const L=n.j?.data?.items||n.j?.data||[];R.contactRules=Array.isArray(L)?L.filter(x=>/clos/i.test(JSON.stringify(x))).map(x=>({name:x.name||x.event||x.key,enabled:x.is_enabled??x.enabled,depts:x.department_ids})):String(JSON.stringify(n.j)).slice(0,300);
const ex=(await api('GET','/desk/tickets/'+M.t+'/notifications')).s;R.ticketNotif=ex;
const f=(await api('GET','/desk/tickets/'+M.t+'/feed?limit=50')).j?.data;const FL=f?.items||f||[];R.mailEvents=(Array.isArray(FL)?FL:[]).filter(e=>/mail|notif|happi|close/i.test(e.action)).map(e=>e.action+' '+JSON.stringify(e.summary||{}).replace(/mahmoud\.mmohamedsamy/g,'G').slice(0,160));
return R;
