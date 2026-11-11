const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',A1='876ce871-2b02-4854-89a7-68050391c62b';const d=JSON.parse(fs.readFileSync('../d14w.json','utf8'));const R={};
R.del=(await api('DELETE','/desk/assignment-rules/'+d.rule)).s;
const r=await api('POST','/desk/assignment-rules',{type:'direct',name:'QA AO D14 web '+d.u,description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:d.u}],pattern:null},coming_to_department_id:DA,move_to_department_id:null,assign:{kind:'agent',user_id:A1,team_id:null}}]});
R.rule=r.s+(r.s>=300?' '+r.t.slice(0,200):'');d.rule=r.j?.data?.id;fs.writeFileSync('../d14w.json',JSON.stringify(d));return R;
