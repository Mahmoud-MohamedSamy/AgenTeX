const main=()=>page.locator('main').last();const clk=l=>l.dispatchEvent('click');const R={};
const reqs=[];page.on('response',async q=>{const u=q.url();if(/tag|workflow\/rules/i.test(u)&&q.request().method()!=='GET'){let b='';try{b=(await q.text()).slice(0,400);}catch(e){}reqs.push(q.request().method()+' '+u.replace(H,'')+' '+q.status()+' '+(q.request().postData()||'').slice(0,300)+' => '+b);}});
await page.goto(H+'/settings/automation/workflow-rules/f7112914-17b5-4bd9-b7d9-84643e3aa3cf',{waitUntil:'domcontentloaded'});await page.getByText('Add Tags').first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const inp=main().locator('input[placeholder*="tag" i]').first();
const pop=async()=>{const t=(await page.locator('body').innerText()).match(/(Create "[^"]*")|No matching tags/g);return t?[...new Set(t)]:[];};
await inp.click();await sleep(1000);
for(const [k,v] of [['lowerDup','qa wf tag c'],['chosenB','QA WF tag B'],['csOnly','Accepted'],['dblSpace','QA  two'],['long','X'.repeat(60)]]){await inp.fill(v);await sleep(2000);R[k]=await pop();}
await inp.fill('QA WF tag B');await sleep(1500);await shot('3058-r2-5-chosen-name.png');
// invalid name: click Create
await inp.fill('QA-1');await sleep(2000);await page.getByText('Create "QA-1"').first().click();await sleep(3000);
R.invalidMsg=(await page.locator('body').innerText()).match(/.{0,100}(letter|digit|space|allowed|valid|cannot|can't|error).{0,120}/gi)?.slice(0,6);
R.toast=await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(()=>[]);
await shot('3058-r2-6-invalid-clicked.png');
await inp.fill('');await sleep(500);
await inp.fill('QA RT20 W2 newtag');await sleep(2000);await page.getByText('Create "QA RT20 W2 newtag"').first().click();await sleep(4000);
R.toast2=await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(()=>[]);
R.chips=(await inp.locator('xpath=ancestor::div[2]').innerText()).replace(/\s+/g,' ').slice(0,200);
await shot('3058-r2-7-created-chip.png');
await page.getByRole('button',{name:'Save',exact:true}).click();await sleep(5000);
R.after=(await page.locator('body').innerText()).match(/.{0,60}(saved|Saved|error|Error).{0,80}/g)?.slice(0,4);
await shot('3058-r2-8-saved.png');
return {R,reqs:reqs.filter(x=>!/resolved-batch|heartbeat|negotiate|realtime/.test(x))};
