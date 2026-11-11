const out={};
const r = await api('GET','/iam/org-units?app_key=desk'); const d = arr(r.j&&r.j.data); out.desk = d.map(x=>({n:x.name,id:x.id,app:x.app_key||x.appKey,members:x.member_count||x.memberCount||(x.members&&x.members.length)}));
const r2 = await api('GET','/iam/org-units'); out.firstAll = arr(r2.j&&r2.j.data).slice(0,3).map(x=>JSON.stringify(x).slice(0,300));
return out;
