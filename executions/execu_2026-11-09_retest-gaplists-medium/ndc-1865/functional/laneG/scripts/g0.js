eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const me=(await api('GET','/iam/me')).j.data;
const r=await api('GET','/iam/users');const U=arr(r.j&&r.j.data);
const nm=u=>u.displayName||'';
const pick=n=>U.filter(u=>new RegExp(n,'i').test(nm(u))).map(u=>({id:u.userId,prof:u.profileNames,name:nm(u),status:u.status}));
return {me:{id:me.user_id,name:me.display_name},n:U.length,keys:Object.keys(U[0]||{}).slice(0,12),tu:pick('^Test User'),qa:pick('^QA Team'),ces:pick('Customer Experience')};
