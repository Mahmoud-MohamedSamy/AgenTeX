eval(require('fs').readFileSync('lib.js','utf8'));
const r=await api('GET','/desk/notification-rules/departments/'+IDS.DA);
return r.j.data.rules.filter(x=>/department|ticket_created|new_ticket|unassigned/.test(x.key+x.use_case+x.category)).map(x=>JSON.stringify(x).slice(0,500));
