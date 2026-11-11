const r=await api('GET','/iam/users'); const a=arr(r.j.data);
const inv=a.filter(x=>x.status!=='active');
const sample=inv[0]; const masked={}; for(const k in sample){ const v=sample[k]; masked[k]= v===null?null : (k==='email'?'<'+String(v).length+' chars>':(typeof v==='string'?v.slice(0,12):v)); }
const keyCounts={ userIdNull:a.filter(x=>!x.userId).length, invIdNull:a.filter(x=>!x.invitationId).length, emailNull:a.filter(x=>!x.email).length };
const dn=new Set(a.map(x=>x.displayName)); const em=new Set(a.map(x=>x.email));
return {total:a.length, invited:inv.length, sampleInvited:masked, keyCounts, uniqueDisplayNames:dn.size, uniqueEmails:em.size};
