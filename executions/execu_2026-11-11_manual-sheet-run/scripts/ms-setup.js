// Day-1 setup: mailboxes M1/M2 (mail.tm), contact "QA MAN Contact 1" (M1), account "QA MAN Account". Idempotent.
const L=require('./lib');
module.exports=async()=>{const R={};const m1=await L.mailbox('M1');const m2=await L.mailbox('M2');R.m1=m1.replace(/^(.{10}).*@/,'$1***@');R.m2=m2.replace(/^(.{10}).*@/,'$1***@');
 const cl=await api('GET','/modules/'+L.CMID+'/records?page=1&per_page=100&sort_by=created_time&sort_dir=desc');const cs=arr(cl.j&&cl.j.data).map(fl);
 R.contactKeys=cs[0]?Object.keys(cs[0]).join(','):'';
 let c=cs.find(o=>o.last_name==='QA MAN Contact 1'||[o.first_name,o.last_name].join(' ').trim()==='QA MAN Contact 1');
 if(!c){const r=await api('POST','/modules/'+L.CMID+'/records',L.body({last_name:'QA MAN Contact 1',email:m1}));R.contactCreate=r.s+' '+r.t.slice(0,150);const id=r.j&&r.j.data&&r.j.data.id;if(id){LED('setup contact "QA MAN Contact 1" '+id+' (M1)');c={id};}}
 R.contact=c&&c.id;
 // accounts module
 const mods=await api('GET','/modules?app_key=desk');R.modules=arr(mods.j&&mods.j.data).map(m=>(m.api_name||m.name)+':'+m.id).join(' | ').slice(0,800);
 return R;};
