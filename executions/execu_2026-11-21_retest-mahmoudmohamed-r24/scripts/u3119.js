const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings',{waitUntil:'commit'});await sleep(9000);
const item=page.getByRole('link',{name:/^Execution History$/}).first();R.menuCount=await page.getByText('Execution History',{exact:true}).count();
const side=await bt();const k=side.indexOf('Execution History');R.menuContext=side.slice(Math.max(0,k-120),k+60);
await page.getByText('Execution History',{exact:true}).first().scrollIntoViewIfNeeded().catch(()=>{});await shot('3119-r1-a-setup-menu.png',{timeout:90000});
await page.getByText('Execution History',{exact:true}).first().click();await sleep(7000);R.afterMenuUrl=page.url().replace(H,'');
R.active=await page.evaluate(()=>{const a=[...document.querySelectorAll('a,button')].find(e=>e.textContent.trim()==='Execution History');return a?(a.getAttribute('aria-current')||a.className.slice(0,120)):null;});
await page.getByText('Execution History',{exact:true}).first().scrollIntoViewIfNeeded().catch(()=>{});await shot('3119-r1-b-menu-highlight.png',{timeout:90000});
// Workflow rules row menu
await page.goto(H+'/settings/workflow-rules',{waitUntil:'commit'});await page.getByText('QA RT21 W2 3105 part').first().waitFor({timeout:90000}).catch(()=>{});await sleep(4000);
const row=page.locator('tr',{hasText:'QA RT21 W2 3105 part'}).first();R.rowFound=await row.count();
if(R.rowFound){const btns=row.locator('button');R.rowBtns=await btns.count();await btns.last().click();await sleep(1500);R.menu=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim());await shot('3119-r1-c-row-menu.png',{timeout:90000});
 const mi=page.getByRole('menuitem',{name:/Execution history/i}).first();if(await mi.count()){await mi.click();await sleep(7000);R.filteredUrl=page.url().replace(H,'');const t=await bt();const i=t.indexOf('When Rule');R.filteredRows=t.slice(i,i+300);const f=t.indexOf('WORKFLOW RULE');R.filter=t.slice(f,f+80);await shot('3119-r1-d-filtered-list.png',{timeout:90000});
  const first=page.locator('table tbody tr').first();if(await first.count()){await first.click();await sleep(5000);await page.getByText('Back to history').first().click();await sleep(5000);R.backUrl=page.url().replace(H,'');await shot('3119-r1-e-back-filtered.png',{timeout:90000});}}}
return R;
