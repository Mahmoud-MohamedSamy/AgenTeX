const id=C.f10[C.f10.length-1];const g=await api('GET','/modules/'+TK+'/records/'+id);log((g.j.data.data||[]).map(x=>x.field+'='+JSON.stringify(x.value).slice(0,60)).join('\n'));
const d=await api('GET','/desk/departments/'+C.D);log(d.s,JSON.stringify(d.j?.data||d.j).slice(0,800));
