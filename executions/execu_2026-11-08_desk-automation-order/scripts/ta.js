// Team Assignment for QA AS6 Dept A: MODE=off|on. Reads back.
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';const p=await api('PUT','/desk/departments/'+D+'/team-assignment',{enabled:process.env.MODE==='on'});
return p.s+' now '+JSON.stringify((await api('GET','/desk/departments/'+D+'/team-assignment')).j?.data);
