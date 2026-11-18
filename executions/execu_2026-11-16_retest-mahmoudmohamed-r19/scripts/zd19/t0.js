module.exports=async(page,z)=>{const o=await z('GET','/api/v1/organizations');return {s:o.s,orgs:(o.j?.data||[]).map(x=>({id:x.id,portal:x.portalName,edition:x.edition,name:x.companyName}))};};
