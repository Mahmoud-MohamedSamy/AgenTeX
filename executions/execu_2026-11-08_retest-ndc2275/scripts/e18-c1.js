module.exports=async()=>{const R={};const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4';const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@');
 const r=await api('GET','/modules/'+CMID+'/records?page=1&per_page=1');const c=arr(r.j&&r.j.data)[0];R.contactKeys=Object.keys(fl(c));R.contactRaw=m(JSON.stringify(c)).slice(0,700);
 const t=await api('GET','/modules/'+T+'/records?page=1&per_page=5');const tk=arr(t.j&&t.j.data).map(fl).find(o=>o.contact);R.ticketContact=tk?m(JSON.stringify({contact:tk.contact,email:tk.email})).slice(0,300):'none with contact';R.ticketKeys=Object.keys(fl(arr(t.j.data)[0]));
 for(const p of ['/modules/'+CMID+'/fields','/modules/'+CMID]){const x=await api('GET',p);R[p]=x.s+' '+String(x.t).slice(0,200);}
 await pg.goto(H+'/views/all/contacts',{waitUntil:'commit',timeout:60000}).catch(()=>{});await pg.waitForTimeout(12000);R.url=pg.url();R.hrefs=await pg.$$eval('a[href]',as=>[...new Set(as.map(a=>a.getAttribute('href')).filter(h=>/contact/i.test(h)))].slice(0,10));
 return R;};
