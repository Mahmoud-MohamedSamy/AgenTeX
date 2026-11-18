module.exports=async(page,z)=>{const r=await z('GET','/api/v1/organizations');return (r.j?.data||[]).map(x=>({id:x.id,n:x.portalName||x.companyName,def:x.isDefault}));};
