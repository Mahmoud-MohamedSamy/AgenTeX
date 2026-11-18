const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8'));
const d=(await api('GET','/modules/'+T+'/records/'+I.TK94)).j.data.data; const g=f=>((d.find(x=>x.field===f)||{}).value||{}).value;
const team=(await api('GET','/desk/teams/'+I.TM94)).j.data; const u=arr((await api('GET','/iam/users?per_page=200')).j?.data).find(x=>(x.id||x.userId)===I.AG94);
const w=(await api('GET','/workflow/rules/'+I.W94)).j.data;
return {owner:g('owner')===I.AG94?'agent':g('owner'), team:g('team')===I.TM94?'QA RT18 2794 team':g('team'), teamName:team&&team.name, agentName:u&&(u.displayName||u.name||u.fullName), ruleActive:w.isActive};
