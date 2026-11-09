eval(require('fs').readFileSync('lib.js','utf8'));
const me=await api('GET','/iam/users/me');const d=await api('GET','/desk/departments/'+IDS.DA);
return {me:me.s, name:me.j?.data?.display_name||me.j?.data?.first_name, dept:d.s, deptName:d.j?.data?.name, team_assignment:d.j?.data?.team_assignment_enabled??d.j?.data?.settings};
