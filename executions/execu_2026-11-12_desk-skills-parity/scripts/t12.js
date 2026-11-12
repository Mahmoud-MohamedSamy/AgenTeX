// TAVI: skill-based RR rule in QA SK12 Dept A, agent A1 has S1 only; tickets B1 [S3], B2 [S3,S1], B3 [] ; auto-add OFF
const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const A1='876ce871-2b02-4854-89a7-68050391c62b', A2='d23fb4e0-248d-41f6-af60-d28885a7007e';
const o={};
o.prefs=(await api('PUT',`/desk/skill-preferences?department_id=${D}`,{auto_add:false,placement:'bottom'})).s;
// existing RR rules for shape
const ex=await api('GET',`/desk/assignment-rules?type=round_robin&department_id=b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6`); o.sample=JSON.stringify(arr(ex.j?.data)[0]||ex.j?.data).slice(0,1500);
return o;
