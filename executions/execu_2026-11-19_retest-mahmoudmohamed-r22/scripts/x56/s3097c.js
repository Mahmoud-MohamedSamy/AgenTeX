const DD='6d68dc90-7ecf-4829-bf51-9beb87282b87',LA='51666421-12cb-426e-b91e-3003a2a1f923';const T=JSON.parse(fs.readFileSync(RUN+'/out/3097.json','utf8'));const o={};
const g=(await api('GET','/desk/teams/'+T.tid)).j?.data;o.keys=Object.keys(g||{}).join(',');
const body={name:g.name,description:g.description,department_id:g.department_id||DD,sources:[{kind:'agent',ref_id:OWNER},{kind:'agent',ref_id:LA}],color:g.color||'blue',icon:g.icon||'star'};
o.putAddLight=E(await api('PUT','/desk/teams/'+T.tid,body));o.members=JSON.stringify((await api('GET','/desk/teams/'+T.tid)).j?.data?.member_user_ids||'');
const b=JSON.parse(fs.readFileSync(RUN+'/out/dd-before-3097.json','utf8'));o.restoreDept=(await api('PATCH','/desk/departments/'+DD,b)).s;LED('3097: '+b.name+' members restored ('+o.restoreDept+')');return o;
