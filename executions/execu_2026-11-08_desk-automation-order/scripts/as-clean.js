// Delete everything the A1–A3 runtime lane made: QA AO rules (AS6 Dept A RR + direct), tickets, contact/account. Checks prefs and switches are back.
eval(fs.readFileSync('lib-as.js','utf8'));const R={rules:{},tickets:{},other:{}};
const rr=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[];const dr=(await api('GET','/desk/assignment-rules?type=direct')).j?.data?.rules||[];
const ids=new Set([...made.rules,...[...rr,...dr].filter(x=>/^QA AO /.test(x.name)).map(x=>x.id)]);
for(const id of ids){const s=(await api('DELETE','/desk/assignment-rules/'+id)).s;R.rules[s]=(R.rules[s]||0)+1;}
for(const id of [...new Set(made.tickets.filter(x=>typeof x==='string'))]){const s=(await api('DELETE','/modules/'+T+'/records/'+id)).s;R.tickets[s]=(R.tickets[s]||0)+1;}
for(const [k,id] of made.other){if(!id)continue;const s=(await api('DELETE','/modules/'+(k==='contact'?CON:ACC)+'/records/'+id)).s;R.other[k+s]=(R.other[k+s]||0)+1;}
R.leftRules=[...((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[]),...((await api('GET','/desk/assignment-rules?type=direct')).j?.data?.rules||[])].filter(x=>/^QA AO /.test(x.name)).length;
R.prefs=await prefs();R.switches=await notif();R.ta=(await api('GET','/desk/departments/'+DA+'/team-assignment')).j?.data;
R.newTicketAlert=((await api('GET','/desk/notification-rules/departments/'+DA)).j?.data?.rules||[]).find(x=>x.key==='department.ticket_created')?.is_enabled;
fs.writeFileSync(MADE,JSON.stringify({rules:[],tickets:[],other:[]}));return R;
