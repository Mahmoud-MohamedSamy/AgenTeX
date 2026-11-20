const DD='6d68dc90-7ecf-4829-bf51-9beb87282b87',LA='51666421-12cb-426e-b91e-3003a2a1f923';const T=JSON.parse(fs.readFileSync(RUN+'/out/3097.json','utf8'));const o={};const b=JSON.parse(fs.readFileSync(RUN+'/out/dd-before-3097.json','utf8'));
await api('PATCH','/desk/departments/'+DD,{...b,agent_user_ids:[...b.agent_user_ids,LA]});LED('3097: light agent re-added to dept for PUT check');
try{const g=(await api('GET','/desk/teams/'+T.tid)).j?.data?.team;
o.putAddLight=E(await api('PUT','/desk/teams/'+T.tid,{name:g.name,description:g.description,department_id:g.department_id,sources:[{kind:'agent',ref_id:OWNER},{kind:'agent',ref_id:LA}],color:g.color,icon:g.icon}));
o.members=JSON.stringify((await api('GET','/desk/teams/'+T.tid)).j?.data?.member_user_ids||'');}finally{o.restoreDept=(await api('PATCH','/desk/departments/'+DD,b)).s;LED('3097: dept members restored again ('+o.restoreDept+')');}
return o;
