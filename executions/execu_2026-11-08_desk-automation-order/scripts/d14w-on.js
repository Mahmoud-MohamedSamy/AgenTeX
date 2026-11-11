// D-14 web form (user 11 Nov: "D-14 => retest NDC-1488, then work on it"). Direct switch on for the test; rule: description contains key -> A1. d14w-off.js restores.
const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',A1='876ce871-2b02-4854-89a7-68050391c62b';const u='AOD14W'+Math.random().toString(36).slice(2,6);const R={u};
const orig=(await api('GET','/desk/assignment/notification-settings')).j.data;fs.writeFileSync('../d14w-orig.json',JSON.stringify(orig));
R.on=(await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true})).s;
const r=await api('POST','/desk/assignment-rules',{type:'direct',name:'QA AO D14 web '+u,description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'description',operator:'contains',value:u}],pattern:null},coming_to_department_id:DA,move_to_department_id:null,assign:{kind:'agent',user_id:A1,team_id:null}}]});
R.rule=r.s;fs.writeFileSync('../d14w.json',JSON.stringify({u,rule:r.j?.data?.id}));
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' D-14 web: direct switch ON (orig in d14w-orig.json, restore with d14w-off.js); rule '+(r.j?.data?.id)+' key '+u+'.\n');return R;
