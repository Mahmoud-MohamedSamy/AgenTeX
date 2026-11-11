const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const U=n.uid;const R={};const g=async()=>(await api('GET','/desk/teams/'+n.team)).j?.data;
const d=await g();const tm=d.team;R.teamKeys=Object.keys(tm).join(',');
const tries=[{...tm,member_user_ids:[U]},{team:{...tm},member_user_ids:[U]},{name:tm.name,department_id:tm.department_id,description:tm.description,member_user_ids:[U]},{name:tm.name,department_id:tm.department_id,agent_user_ids:[U]},{name:tm.name,department_id:tm.department_id,members:[U]}];
for(let i=0;i<tries.length;i++){const b=tries[i];for(const k of ['id','created_at','updated_at','created_by','updated_by'])if(b[k]!==undefined)delete b[k];const r=await api('PUT','/desk/teams/'+n.team,b);const m=(await g()).member_user_ids||[];R['try'+i]=r.s+(r.s>=300?' '+r.t.slice(0,140):'')+' members='+m.length;if(m.includes(U))break;}
return R;
