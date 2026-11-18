module.exports=async(page,z)=>{const o={};const H='QA RT19 ZD 2963 <img src=x onerror="window.__x=1"> <b>bold</b> <a href="javascript:alert(1)">link</a>';
const t=await z('POST','/api/v1/tickets',{subject:'QA RT19 ZD 2963 comment',departmentId:'1499272000000432293',contact:{lastName:'QA RT19 ZD',email:'qa.rt19.zd@example.com'}});o.t=t.s+' '+t.j?.id+' #'+t.j?.ticketNumber;const id=t.j?.id;
for(const ct of ['html','plainText']){const c=await z('POST','/api/v1/tickets/'+id+'/comments',{content:H,contentType:ct,isPublic:false});o['post_'+ct]=c.s+' '+(c.s<300?JSON.stringify({id:c.j.id,contentType:c.j.contentType,content:c.j.content}):c.t.slice(0,200));}
const l=await z('GET','/api/v1/tickets/'+id+'/comments');o.list=(l.j?.data||[]).map(x=>({ct:x.contentType,content:x.content}));return o;};
