module.exports=async(page,z)=>{const g=await z('GET','/api/v1/tickets/1499272000000480038');const f=await z('GET','/api/v1/organizationFields?module=tickets');
const ss=await z('GET','/api/v1/skillsConfiguration');const st=await z('GET','/api/v1/skillTypes?departmentId=1499272000000006907');
return {keys:Object.keys(g.j||{}).join(','),skillFields:(f.j?.data||[]).filter(x=>/skill/i.test(x.apiName+x.displayLabel)).map(x=>x.apiName+'/'+x.type),fs:f.s,ss:ss.s+' '+ss.t.slice(0,300),st:st.s+' '+st.t.slice(0,400)};};
