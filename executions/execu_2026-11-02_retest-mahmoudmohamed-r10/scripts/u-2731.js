const st={};
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit',timeout:120000});
for(let i=0;i<40;i++){ await sleep(3000); if((await text()).includes('MultipleConditions')) break; } await sleep(3000);
st.head=(await page.locator('table thead').innerText().catch(()=>'')).replace(/\s+/g,' | ');
const rows=page.locator('table tbody tr'); const n=await rows.count(); st.rows=[];
for(let i=0;i<n;i++){ const t=(await rows.nth(i).innerText()).replace(/\s+/g,' | '); if(/MultipleConditions|QA RT r10|AEX-01|auditlog/.test(t)) st.rows.push(t.slice(0,200)); }
const r=page.locator('table tbody tr',{hasText:'MultipleConditions'}).first(); await r.scrollIntoViewIfNeeded(); await sleep(1000); await shot('2731-list.png');
await r.click(); for(let i=0;i<30;i++){ await sleep(3000); if(/Condition 2|Records not meeting/i.test(await text())) break; } await sleep(2000);
const t=await text(); st.page={conditions:(t.match(/Condition \d+/g)||[]).length, actionsWords:(t.match(/Add Tags|Assign Owner|Field Update|Owner Assignment/g)||[]).length}; await shot('2731-rule.png');
return st;
