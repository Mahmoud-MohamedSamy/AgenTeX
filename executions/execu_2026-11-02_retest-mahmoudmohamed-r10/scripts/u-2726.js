const st={};
await page.goto(H+'/settings/automation/workflow-rules/4a4bc7ee-e161-4356-887d-2390d99d1f8b',{waitUntil:'commit',timeout:120000});
for(let i=0;i<50;i++){ await sleep(3000); if((await text()).includes('QA RT r10 2726 WF')) break; } await sleep(4000);
const t=await text(); st.hasLabel=/Owner of the triggering record|triggering record/i.test(t); st.snip=(t.match(/.{0,80}triggering record.{0,80}/i)||['-'])[0].replace(/\s+/g,' ');
const el=page.getByText(/triggering record/i).first(); if(await el.count()){ await el.scrollIntoViewIfNeeded(); await sleep(1500); }
await shot('2726-rule-actions.png'); st.url=page.url();
return st;
