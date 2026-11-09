const T='88e8ea44-1658-4df3-9930-d0902b91073d';const r=await api('GET','/modules/'+T+'/layouts');const L=arr(r.j&&r.j.data);
const D=Object.fromEntries(arr((await api('GET','/desk/departments')).j.data).map(d=>[d.id,d.name]));
return {n:L.length,keys:L[0]&&Object.keys(L[0]),ls:L.map(l=>(l.name)+' | '+(l.id||l.layoutId)+' | depts='+((l.departmentIds||l.department_ids||[]).map(i=>D[i]||i).join(','))+' | st='+JSON.stringify(l.statusConfig||l.statuses||l.status_settings||null).slice(0,200))};
