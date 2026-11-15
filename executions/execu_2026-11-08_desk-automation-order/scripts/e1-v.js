eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const r=await rec(M.t);const s=(await api('GET','/desk/tickets/'+M.t+'/sla')).j?.data;
return {subject:r.subject,num:r.ticket_number,created:r.created_at,slaKeys:Object.keys(s||{}),policy:s?.policy?.name||s?.policy_name||s?.applied_policy_name,target:s?.target?.name||s?.target_name};
