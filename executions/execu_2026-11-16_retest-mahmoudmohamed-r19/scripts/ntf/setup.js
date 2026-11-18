const R={};
if(!I.D){const r=await api('POST','/desk/departments',{name:'QA RT19 NTF Dept',description:'QA retest round 19 notifications lane',agent_user_ids:[A1,A3,A2,O]});R.dept=E(r);if(r.j?.data?.id){I.D=D=r.j.data.id;saveI();LED('department "QA RT19 NTF Dept" '+D+' created, agents Test User 1 + Dev Team 2 + Mahmoud Samy + owner (none members before)');}}
D=I.D;
const r=await api('GET','/desk/notification-rules/departments/'+D);fs.writeFileSync(OUT+'rules-orig.json',JSON.stringify(r.j,null,1));
const L=Ls(r.j?.data);R.n=L.length;R.rules=L.map(x=>[x.category,x.key,x.use_case,'en='+x.is_enabled,'em='+x.email_enabled,'tpl='+(x.template_id||x.email_template_id||'-'),x.saved??x.is_saved??''].join(' | '));
R.keys=L[0]?Object.keys(L[0]):[];R.top=Object.keys(r.j?.data||{});
return R;
