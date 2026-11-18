const R={};
const L=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data);R.rulesNow=L.filter(x=>['agent.ticket_assigned','agent.comment_added','team.ticket_assigned'].includes(x.key)).map(x=>x.key+' en='+x.is_enabled+' email='+x.email_enabled+' tpl='+x.template_id+' ch='+x.channels);
if(!I.team){const t=await api('POST','/desk/teams',{name:'QA RT19 NTF Team',description:'QA RT19 NTF',department_id:D,sources:[{kind:'agent',ref_id:A2}]});R.team=E(t);I.team=t.j?.data?.id;saveI();if(I.team)LED('team "QA RT19 NTF Team" '+I.team+' created in QA RT19 NTF Dept, member Mahmoud Samy');}
const t1=await mkT('2864 A default tpl assign to Samy');R.t1=t1;
await sleep(3000);
t1.assignAt=new Date().toISOString();R.assign=E(await api('POST','/desk/tickets/'+t1.id+'/assign',{owner_id:A2,team_id:null}));
await sleep(4000);
t1.commentAt=new Date().toISOString();R.comment=E(await api('POST','/desk/tickets/'+t1.id+'/comments',{body_html:'<p>QA RT19 NTF 2864 comment by owner on Samy ticket</p>',is_public:false}));
const t2=await mkT('2864 B default tpl assign to team');R.t2=t2;await sleep(3000);
t2.assignAt=new Date().toISOString();R.assignTeam=E(await api('POST','/desk/tickets/'+t2.id+'/assign',{owner_id:null,team_id:I.team}));
I.t2864a={t1,t2};saveI();
await sleep(30000);
R.f1=await feedS(t1.id);R.f2=await feedS(t2.id);
return R;
