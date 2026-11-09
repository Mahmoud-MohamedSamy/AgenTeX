eval(require('fs').readFileSync('lib.js','utf8'));
const ns=(await api('GET','/desk/assignment/notification-settings')).j.data;const ta=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data;const pr=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
const nr=(await api('GET','/desk/notification-rules/departments/'+IDS.DA)).j.data.rules.find(r=>r.key==='department.ticket_created').is_enabled;
const rr=(await rules('round_robin',IDS.DA)).map(r=>r.name+':'+r.execute_on.join('+')+':'+r.is_active);
return {ns,ta,pr,deptCreatedAlert:nr,rr};
