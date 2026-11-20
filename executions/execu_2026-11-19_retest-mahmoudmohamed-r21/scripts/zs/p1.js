module.exports=async(page,z)=>{const o={};const D='1499272000000006907';
for(const u of ['/api/v1/templates?departmentId='+D+'&limit=50','/api/v1/templates?module=tickets&departmentId='+D+'&limit=50','/api/v1/templates?departmentId='+D+'&templateType=email&limit=50','/api/v1/departments/'+D+'/emailSettings','/api/v1/settings/email','/api/v1/departments?limit=20','/api/v1/autoAcknowledgment?departmentId='+D,'/api/v1/emailAutoAcknowledgment?departmentId='+D]){const r=await z('GET',u);o[u]=r.s+' '+r.t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,700);}
return o;};
