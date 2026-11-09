await page.setViewportSize({width:1600,height:1000});
const out={};
// users paging
const u1=await api('GET','/iam/users?page=1&pageSize=5');const u2=await api('GET','/iam/users?page=2&pageSize=5');const u3=await api('GET','/iam/users?pageSize=500');const u4=await api('GET','/iam/users?limit=5&offset=5');
const ids=r=>(r.t.match(/"(?:id|userId|user_id)":"([0-9a-f-]{36})"/g)||[]).slice(0,6).map(s=>s.slice(-37,-1));
const cnt=r=>{const a=arr(r.j);return {s:r.s,len:a.length,keys:r.j&&!Array.isArray(r.j)?Object.keys(r.j).slice(0,10):'array',total:r.j&&(r.j.total||r.j.totalCount||r.j.total_count||(r.j.meta&&JSON.stringify(r.j.meta)))}};
out.users={p1:cnt(u1),p2:cnt(u2),big:cnt(u3),off:cnt(u4),p1ids:ids(u1),p2ids:ids(u2),offids:ids(u4)};
// a ticket
const q=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?pageSize=3');
const tid=(q.t.match(/"id":"([0-9a-f-]{36})"/)||[])[1];out.tid=tid;out.qs=q.s;
// RR settings
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
try{await page.getByRole('tab',{name:'Round Robin'}).first().click();}catch(e){try{await page.getByText('Round Robin',{exact:true}).first().click()}catch(e2){}}
await page.waitForTimeout(8000);
let t=await page.locator('body').innerText();out.rr=t.slice(t.lastIndexOf('Email Providers')+15).replace(/\n+/g,' | ').slice(0,3000);
await page.screenshot({path:'evidence/raw/rr.png'});
// analytics
await page.goto(H+'/',{waitUntil:'load',timeout:120000});await page.waitForTimeout(6000);
try{await page.getByRole('link',{name:'Analytics',exact:true}).first().click();await page.waitForTimeout(9000);}catch(e){out.anErr=String(e.message).slice(0,100)}
out.analyticsUrl=page.url();t=await page.locator('body').innerText();out.analytics=t.replace(/\n+/g,' | ').slice(0,1500);
await page.screenshot({path:'evidence/raw/analytics.png'});
return out;
