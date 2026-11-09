const o={};
const dr=await api('GET','/desk/departments?limit=200');o.deptS=dr.s;const D=arr(dr.j&&dr.j.data&&(dr.j.data.departments||dr.j.data));o.deptCount=D.length;o.deptKeys=Object.keys(D[0]||{}).slice(0,12).join(',');
const t0=await api('GET','/desk/skill-types');o.noDept=t0.s+' '+t0.t.slice(0,300);
const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';const t1=await api('GET','/desk/skill-types?department_id='+DA);o.DA=t1.s+' '+t1.t.slice(0,700);
return o;
