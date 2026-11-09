const id='199c4f46-bdd5-4f76-9b2e-7c91ebcdc9bd'; const st={}; const reqs=[];
page.on('request', r=>{ if(/assignment-rules/.test(r.url()) && r.method()!=='GET') reqs.push(r.method()+' '+r.url().replace(/^.*api\/v1/,'')+' '+String(r.postData()||'').slice(0,400)); });
page.on('response', r=>{ if(/assignment-rules/.test(r.url()) && r.request().method()!=='GET') reqs.push('→ '+r.status()); });
await page.goto(H+'/settings/automation/assignment-rules/'+id,{waitUntil:'commit',timeout:120000});
for(let i=0;i<40;i++){ await sleep(3000); if((await text()).includes('QA RT r10 2714 AR')) break; }
await sleep(3000); await shot('2714-rule-open.png'); st.url=page.url();
const t=await text(); st.text=t.slice(t.indexOf('QA RT r10 2714'),t.indexOf('QA RT r10 2714')+600).replace(/\s+/g,' ');

await page.mouse.click(964,632); await sleep(3000); await shot('2714-entry-open.png');
const se=page.getByRole('button',{name:/Save Rule Entry/i}); st.seCount=await se.count(); if(st.seCount) { await se.first().click(); await sleep(2500); }
await shot('2714-entry-saved.png');
await page.getByRole('button',{name:'Save',exact:true}).click(); await sleep(6000); await shot('2714-rule-saved.png');
st.after=(await text()).match(/(saved|updated).{0,80}/i)?.[0];
return {st,reqs};