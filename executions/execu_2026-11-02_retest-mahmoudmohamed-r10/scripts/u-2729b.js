const st={};
await page.goto(H+'/settings/blueprints/'+T.LEADS+'/482aaf78-ffe9-441f-80f9-a3614e28d3a3',{waitUntil:'commit',timeout:120000});
for(let i=0;i<40;i++){ await sleep(3000); if((await text()).includes('QA web to referral')) break; } await sleep(3000);
await page.getByText('QA web to referral',{exact:false}).first().click(); await sleep(3000);
await page.getByRole('tab',{name:'After'}).click(); await sleep(2000);
await page.getByRole('button',{name:'Create task',exact:true}).click(); await sleep(3000);
await page.getByText('Specific user',{exact:true}).click(); await sleep(2000); await page.getByText('Specific user',{exact:true}).scrollIntoViewIfNeeded(); await shot('2729-task-specific-user.png');
st.afterSpecific=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>/user|Choose/i.test(x));
const rr=page.getByRole('button',{name:'This record'}); st.rr=await rr.count(); if(st.rr){ await rr.scrollIntoViewIfNeeded(); await rr.click(); await sleep(2500); await shot('2729-task-related-record.png'); st.rrOpen=(await page.locator('[role=listbox],[role=dialog],[role=menu]').allInnerTexts().catch(()=>[])).join(' ').slice(0,400).replace(/\s+/g,' '); }
return st;
