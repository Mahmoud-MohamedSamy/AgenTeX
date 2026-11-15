eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const R={};
const r=await api('GET','/desk/notification-rules/departments/'+DA);const L=r.j?.data?.rules||r.j?.data?.items||r.j?.data||[];
R.rule=L.filter(x=>/ticket_closed/.test(x.key)).map(x=>({key:x.key,enabled:x.is_enabled,email:x.email_enabled,customized:x.is_customized,template:x.template_name,tid:x.template_id,valid:x.template_binding_valid,channels:x.channels,switches:x.channel_switches,optin:x.address_opt_in}));
const f=await feed(M.ctl);R.ctlFeed=f.reverse().map(e=>(e.occurred_at||'').slice(11,19)+' '+e.action+' '+JSON.stringify(e.summary||{}).replace(/mahmoud\.mmohamedsamy/g,'G').slice(0,140));
// other depts for comparison
for(const d of ['93949fbd-f9df-4e2e-ae45-00b8dc38385b']){const x=await api('GET','/desk/notification-rules/departments/'+d);const Y=x.j?.data?.rules||x.j?.data?.items||x.j?.data||[];R['QA AO Dept A']=Y.filter(z=>z.key==='contact.ticket_closed').map(z=>({enabled:z.is_enabled,email:z.email_enabled,template:z.template_name,valid:z.template_binding_valid}));}
const h=(await api('GET','/desk/happiness/settings')).j?.data;R.happinessEnabled=h?.is_enabled;
return R;
