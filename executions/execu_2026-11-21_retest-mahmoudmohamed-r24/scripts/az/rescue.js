var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const out={};
// all AZ rules: ensure inactive
const all=[];for(const [t,d] of [['round_robin',DA],['round_robin',DB],['round_robin',AOB]]){for(const r of await listRules(t,d))if(/QA RT20 AZ/.test(r.name))all.push([r.id,r.name,r.is_active,d===AOB?'AOB':'DA/DB']);}
out.rules=all;for(const r of all)if(r[2])out['off '+r[1]]=await setA(r[0],false);
const PB=JSON.parse(fs.readFileSync(OUT+'thrc-prefs-orig.json','utf8'));const cur=await prefs(AOB);out.prefsWas=JSON.stringify(cur)===JSON.stringify(PB)?'already orig':JSON.stringify(cur);
if(JSON.stringify(cur)!==JSON.stringify(PB)){out.restore=E(await setPrefs(PB,AOB));out.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB);}
// tickets THC: report owner/feed then close
const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));out.t=[];
for(const id of M.tickets){const r=await rec(id);if(!/THC/.test(r.subject||''))continue;const f=(await feed(id)).filter(e=>/auto_assign|skip|backlog/.test(e.action)).map(e=>e.action.replace('ticket.','')+'@'+e.occurred_at.slice(11,19));out.t.push([(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number,r.subject.slice(11),r.status,nm(r.owner),JSON.stringify(f)].join(' '));}
LED('rescue after thrc timeout: rules '+JSON.stringify(all.map(r=>r[1]+':'+r[2]))+'; AOB prefs '+out.prefsWas+(out.restore?' restored '+out.same:''));
return out;
