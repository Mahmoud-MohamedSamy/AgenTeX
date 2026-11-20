const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await page.getByText('Workflow Rules',{exact:true}).first().waitFor({timeout:90000});await page.getByText('Workflow Rules',{exact:true}).first().click();await sleep(8000);R.rulesUrl=page.url().replace(H,'');
const s=page.getByPlaceholder(/search/i).last();if(await s.count()){await s.fill('3105 part').catch(()=>{});await sleep(4000);}
let t=await bt();R.hasRule=t.includes('QA RT21 W2 3105 part');
const row=page.locator('tr, [role=row], li, div[class*=row]',{hasText:'QA RT21 W2 3105 part'}).last();R.rowFound=await row.count();
if(R.rowFound){const b=row.locator('button');R.rowBtns=await b.count();await b.last().click();await sleep(1500);R.menu=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim());await shot('3119-r1-c-row-menu.png',{timeout:90000});
 const mi=page.getByRole('menuitem',{name:/Execution history/i}).first();if(await mi.count()){await mi.click();await sleep(7000);R.filteredUrl=page.url().replace(H,'');t=await bt();const i=t.indexOf('When Rule');R.filteredRows=t.slice(i,i+300);const f=t.indexOf('WORKFLOW RULE');R.filter=t.slice(f,f+60);await shot('3119-r1-d-filtered-list.png',{timeout:90000});
  await page.locator('table tbody tr').first().click();await sleep(5000);R.runUrl=page.url().replace(H,'');await page.getByText('Back to history').first().click();await sleep(5000);R.backUrl=page.url().replace(H,'');t=await bt();R.backFilter=t.slice(t.indexOf('WORKFLOW RULE'),t.indexOf('WORKFLOW RULE')+60);await shot('3119-r1-e-back-filtered.png',{timeout:90000});}}
else{await shot('3119-r1-c-rules-page.png',{timeout:90000});}
return R;
