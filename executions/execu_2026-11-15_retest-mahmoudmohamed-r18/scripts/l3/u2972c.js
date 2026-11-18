const PROF='fd8263b4-de5d-4859-8603-47dd47fa41a6'; const reqs=[]; page.on('response',async r=>{const u=r.url(); const m=r.request().method(); if(/api\/v1\/iam/.test(u)&&m!=='GET'&&!/iam\/auth/.test(u)) reqs.push(m+' '+u.split('/api/v1')[1].slice(0,120)+' '+r.status()+' '+(r.request().postData()||'').slice(0,200)+' => '+(await r.text().catch(()=>'')).slice(0,200));});
await page.goto(H+'/settings/users-control/permissions?profileId='+PROF,{waitUntil:'domcontentloaded'}); await sleep(12000);
const k=page.getByText('desk:tags:manage',{exact:true}).first(); log('found', await k.count()); await k.scrollIntoViewIfNeeded(); await sleep(800);
const row=k.locator('xpath=ancestor::*[.//button[normalize-space()="GRANT" or normalize-space()="Grant"]][1]'); log('row', (await row.innerText()).replace(/\n/g,' | ').slice(0,200));
await shot('2972-3-before.png'); 
const gb=row.getByRole('button',{name:/^grant$/i}).first(); log('grant attrs', await gb.evaluate(e=>({p:e.getAttribute('aria-pressed'),c:e.className.slice(0,120),d:e.disabled})));
await gb.click(); await sleep(2500); log('grant after', await gb.evaluate(e=>({p:e.getAttribute('aria-pressed'),c:e.className.slice(0,120)})));
const t=await text(); log('save-ish', (t.match(/[^\n]*(Save|unsaved|changes|Discard)[^\n]*/gi)||[]).slice(0,6));
await shot('2972-4-after-click.png'); log('reqs', reqs);
