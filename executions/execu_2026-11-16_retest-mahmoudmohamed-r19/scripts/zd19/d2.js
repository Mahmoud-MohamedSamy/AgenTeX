// D2: 5 parallel API creates, check ticketNumber in response, then GET each and its History right away
module.exports=async(page,z)=>{const D='1499272000000432293';// Tech dept
const t0=Date.now();const rs=await Promise.all([1,2,3,4,5].map(i=>z('POST','/api/v1/tickets',{subject:'QA RT19 ZD D2 burst '+i,departmentId:D,contact:{lastName:'QA RT19 ZD',email:'qa.rt19.zd@example.com'}})));
const t1=Date.now();const out={ms:t1-t0,creates:rs.map(r=>({s:r.s,id:r.j?.id,num:r.j?.ticketNumber,created:r.j?.createdTime,owner:r.j?.assigneeId,err:r.s>=300?r.t.slice(0,300):undefined}))};
const chk=[];for(const r of rs){if(!r.j?.id)continue;const g=await z('GET','/api/v1/tickets/'+r.j.id);const h=await z('GET','/api/v1/tickets/'+r.j.id+'/History?limit=10');
chk.push({id:r.j.id,num:g.j?.ticketNumber,hs:h.s,hist:(h.j?.data||[]).map(e=>e.eventName+(e.eventInfo?':'+e.eventInfo.map(x=>x.propertyName).join(','):'')),ht:h.s>=300?h.t.slice(0,200):undefined,sinceCreateMs:Date.now()-t0});}
out.chk=chk;return out;};
