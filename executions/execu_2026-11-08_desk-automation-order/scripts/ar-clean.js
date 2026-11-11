const m=JSON.parse(fs.readFileSync('../ar1-made.json','utf8'));const R={rules:{},tickets:{}};
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';const all=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+D)).j?.data?.rules||[];
const ids=new Set([...m.rules,...all.filter(r=>/^QA AO /.test(r.name)).map(r=>r.id)]);
for(const id of ids){const s=(await api('DELETE','/desk/assignment-rules/'+id)).s;R.rules[s]=(R.rules[s]||0)+1;}
for(const id of m.tickets.filter(Boolean)){const s=(await api('DELETE','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id)).s;R.tickets[s]=(R.tickets[s]||0)+1;}
R.left=((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+D)).j?.data?.rules||[]).filter(r=>/^QA AO /.test(r.name)).length;
return R;
