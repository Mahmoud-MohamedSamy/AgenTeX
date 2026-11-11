const o={};for(const [n,id] of [['A',D],['AS6',D2]]){
 const s=await api('GET','/desk/skills?department_id='+id);o[n+'skills']=[s.s,JSON.stringify(s.j?.data).slice(0,300)];
 const a=await api('GET','/desk/departments/'+id+'/agents');o[n+'agents']=[a.s,JSON.stringify(a.j?.data).slice(0,300)];}
return o;
