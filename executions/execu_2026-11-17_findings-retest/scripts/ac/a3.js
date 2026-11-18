const CSORIG=['2a7c1bc4-f6d4-4bd3-805e-0496ece13987','5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1','7e5e7c27-46e4-4bf6-b021-7bd219d34472','97be04b6-0a08-4883-aa51-e1650b11cab7','9d182dfa-05f3-4af7-9685-8615a2fbe537'];
const out={};
out.addCS=await pr('PUT','/desk/departments/'+DEP.CS+'/agents',{agent_user_ids:[...CSORIG,US.D,US.E],view_only_agent_user_ids:['7e5e7c27-46e4-4bf6-b021-7bd219d34472']}); led('CS members + D,E (restore to 5 orig + view-only 7e5e7c27): '+out.addCS);
out.light=await pr('POST','/iam/users/'+US.D+'/profiles',{profile_id:'44444444-4444-4444-4444-444444444403',scope_id:MGR,replace:true}); led('D profile -> Desk Light Agent (restore Desk Supervisor ...404): '+out.light);
let r=await api('GET','/iam/users?limit=100&page=1'); let L=D(r.j); r=await api('GET','/iam/users?limit=100&page=2'); L=L.concat(D(r.j)); out.dProf=(L.find(u=>u.userId===US.D)||{}).profileNames;
const T3=await mkT('T3',{subject:'QA RT21 AC A3 light team ticket',department:DEP.CS,status:'Open',email:'qa-rt21-ac@example.com',channel:'phone'}); out.T3=T3;
const nt=await api('POST','/desk/teams',{name:'QA RT21 AC Light Team',description:'findings retest, delete after',department_id:DEP.CS,sources:[{kind:'agent',ref_id:US.D}],color:'blue',icon:'star'});
out.team=nt.s+' '+nt.t.slice(0,300); const tid=D(nt.j)&&D(nt.j).id; if(tid){IDS.team=tid;saveIds();led('team QA RT21 AC Light Team '+tid);}
if(tid){const t=await api('GET','/desk/teams/'+tid); out.teamRead=JSON.stringify(D(t.j)).slice(0,400);
 out.assignTeam=await pr('POST','/desk/tickets/'+T3+'/assign',{owner_id:null,team_id:tid});
 const tt=await tk(T3); out.t3=JSON.stringify(tt).match(/"(team_id|owner_id|ticket_number)":[^,]*/g);}
out.ownerLight=await pr('POST','/desk/tickets/'+T3+'/assign',{owner_id:US.D});
return out;
