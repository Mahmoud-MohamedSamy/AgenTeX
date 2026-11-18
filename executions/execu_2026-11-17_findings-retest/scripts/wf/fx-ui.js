const main=()=>page.locator('main').last();const R={};
// list for F17 ticket
await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await page.getByRole('row').nth(1).waitFor({timeout:150000}).catch(()=>{});await sleep(4000);
R.filtersBefore=(await main().innerText()).slice(0,600).replace(/\s+/g,' ');
R.inputs=await main().locator('input,select,button[role=combobox],[role=combobox]').evaluateAll(a=>a.map(x=>(x.getAttribute('placeholder')||x.getAttribute('aria-label')||x.innerText||x.tagName).slice(0,40)));
const rid=page.getByPlaceholder(/record/i).first();
if(await rid.count()){await rid.fill('d84f19f2-53d9-4768-bff0-7f5151bf09b5');await rid.press('Enter');await sleep(5000);}else R.noRid=true;
R.listRows=(await page.getByRole('row').allInnerTexts()).slice(0,4).map(s=>s.replace(/\s+/g,' '));
await shot('F17-1-list-fired.png');
// status filter present?
R.statusFilter=await main().getByText(/^(Outcome|Status|Failed)$/).count();
// detail F17
await page.goto(H+'/settings/workflow-executions/6e51b835-e94a-4f8e-b237-8dd05b284b79',{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:150000}).catch(()=>{});await sleep(4000);
let t=(await main().innerText()).replace(/\s+/g,' ');let i=t.indexOf('Back to history');R.f17detail=t.slice(i,i+1200);
await shot('F17-2-run-detail.png');
const cell=page.getByText(/Not created: Calls/).first();if(await cell.count()){R.cellText=await cell.innerText();R.cellTitle=await cell.getAttribute('title');await cell.hover();await sleep(1500);await shot('F17-3-detail-hover.png');}
// F15 detail: F02 owner run + F03 tags run
for(const [n,id] of [['F15-1-owner-run','0981b720-daaf-47f4-9f38-9750e8325d39'],['F15-2-tags-run','0d751c04-35ac-475e-a580-fff4005c4b19']]){await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'commit'});await page.getByText('Back to history').first().waitFor({timeout:150000}).catch(()=>{});await sleep(4000);t=(await main().innerText()).replace(/\s+/g,' ');i=t.indexOf('Back to history');R[n]=t.slice(i,i+1200);await shot(n+'.png');}
return R;
