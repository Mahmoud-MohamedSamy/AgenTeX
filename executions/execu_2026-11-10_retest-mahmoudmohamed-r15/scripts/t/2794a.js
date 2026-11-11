const out={};
for (const p of ['/desk/teams','/iam/teams?app_key=desk','/iam/teams']) { const r=await api('GET',p); const a=arr(r.j&&r.j.data); out[p]={s:r.s, n:a.length, sample:a.slice(0,12).map(t=>({id:t.id||t.teamId, name:t.name, members:(t.members||t.member_ids||t.memberIds||[]).length||t.member_count||t.memberCount, dept:t.department_id||t.departmentId}))}; if(a.length) break; }
return out;
