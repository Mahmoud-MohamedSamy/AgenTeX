// Removes everything Part B made (../pb-made.json): workflow rules, assignment rules, tickets, skills, SLA policies, blueprints. Restores the direct switch.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const c={wf:0,rules:0,tickets:0,skills:0,sla:0,bp:0,fail:[]};const ok=(k,s,id)=>{if(s<300||s===404)c[k]++;else c.fail.push(k+' '+id+' '+s);};
for(const id of pbm.wf)ok('wf',(await api('DELETE','/workflow/rules/'+id)).s,id);
for(const id of pbm.bp){await api('POST','/desk/blueprints/'+id+'/revoke',{ticket_ids:null,after:null});ok('bp',(await api('DELETE','/modules/'+T+'/blueprints/'+id)).s,id);}
for(const id of pbm.tickets)ok('tickets',(await api('DELETE','/modules/'+T+'/records/'+id)).s,id);
for(const id of pbm.rules){try{await setA(id,false);}catch(e){}ok('rules',(await api('DELETE','/desk/assignment-rules/'+id)).s,id);}
for(const id of pbm.sla)ok('sla',(await api('DELETE','/desk/sla/policies/'+id)).s,id);
for(const id of pbm.skills)ok('skills',(await api('DELETE','/desk/skills/'+id+'?department_id='+DA)).s,id);
if(fs.existsSync('../pb-switch-orig.json')){const o=JSON.parse(fs.readFileSync('../pb-switch-orig.json','utf8'));c.switch=(await api('PUT','/desk/assignment/notification-settings',o)).s;c.direct=(await notif()).direct_rules_enabled;}
if(!c.fail.length){fs.writeFileSync(PBF+'.done-'+Date.now(),JSON.stringify(pbm));fs.writeFileSync(PBF,JSON.stringify({wf:[],rules:[],tickets:[],skills:[],sla:[],bp:[],other:[]}));}
return c;
