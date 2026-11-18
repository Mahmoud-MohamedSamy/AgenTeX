const R={};const main=()=>page.locator('main').last();const clk=l=>l.dispatchEvent('click');
const dialogs=[];page.on('dialog',d=>{dialogs.push(d.message());d.dismiss().catch(()=>{});});
const xss=async()=>page.evaluate(()=>({xss:window.__xss===undefined?'unset':window.__xss}));
// 1 editor
await page.goto(H+'/settings/automation/workflow-rules/45ed37b1-a922-4f96-9e0e-3735aefe313e',{waitUntil:'domcontentloaded'});await sleep(9000);
const hdr=main().getByText('Add comment',{exact:false}).first();
const exp=main().locator('button',{hasText:/^Add comment$/}).first();if(await exp.count())await clk(exp);await sleep(1500);
R.editor={...(await xss()),imgs:await page.evaluate(()=>[...document.querySelectorAll('main img, main [contenteditable] img')].map(i=>({src:i.getAttribute('src'),onerror:i.getAttribute('onerror')}))),
 links:await page.evaluate(()=>[...document.querySelectorAll('main [contenteditable] a, .ProseMirror a, .tiptap a')].map(a=>a.getAttribute('href'))),
 editorText:await page.evaluate(()=>{const e=document.querySelector('[contenteditable=true]');return e?e.innerText.slice(0,300):null;}),
 editorHtml:await page.evaluate(()=>{const e=document.querySelector('[contenteditable=true]');return e?e.innerHTML.slice(0,600):null;}),
 descText:(await main().innerText()).match(/QA RT19 2963 desc[^\n]{0,80}/)?.[0]};
await shot('2963-1-editor.png');
const ce=page.locator('[contenteditable=true]').first();if(await ce.count()){await ce.scrollIntoViewIfNeeded();await sleep(500);await shot('2963-1b-editor-comment.png');}
// 2 rules list
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(1500);
const sr=page.getByPlaceholder(/Search/i).last();if(await sr.count()){await sr.fill('QA RT19 WF 2963');await sleep(2500);}
R.list={...(await xss()),row:(await page.getByRole('row').filter({hasText:'QA RT19 WF 2963'}).first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300)};
await shot('2963-2-list.png');
// 3 execution history
await page.goto(H+'/settings/workflow-executions',{waitUntil:'domcontentloaded'});await sleep(8000);
const rid=page.getByPlaceholder(/record/i).first();
if(await rid.count()){await rid.fill('553b14ba-0a90-489e-93c3-7cfc4c66fd3a');await rid.press('Enter');await sleep(4000);}
else{const inp=main().locator('input').nth(1);await inp.fill('553b14ba-0a90-489e-93c3-7cfc4c66fd3a');await inp.press('Enter');await sleep(4000);}
const row=page.getByRole('row').filter({hasText:'553b14ba'}).first();if(await row.count()){await row.click();await sleep(2500);}
R.exec={...(await xss()),text:(await main().innerText()).replace(/\s+/g,' ').slice(-900)};
await shot('2963-3-exec.png',{fullPage:true});
// 4 ticket comment
await page.goto(H+'/tickets/553b14ba-0a90-489e-93c3-7cfc4c66fd3a',{waitUntil:'domcontentloaded'});await sleep(10000);
R.ticketUrl=page.url().replace(H,'');
const c=page.getByText('QA RT19 2963 comment').first();if(await c.count()){await c.scrollIntoViewIfNeeded();await sleep(800);}
R.ticket={...(await xss()),found:await c.count(),imgs:await page.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>i.getAttribute('src')==='x').map(i=>({onerror:i.getAttribute('onerror')}))),
 anchors:await page.evaluate(()=>[...document.querySelectorAll('a')].filter(a=>a.innerText.trim()==='lnk').map(a=>a.getAttribute('href'))),
 commentHtml:await page.evaluate(()=>{const n=[...document.querySelectorAll('*')].find(e=>e.children.length<8&&e.innerHTML.includes('QA RT19 2963 comment'));return n?n.innerHTML.slice(0,500):null;}),
 bold:await page.evaluate(()=>[...document.querySelectorAll('b,strong')].some(b=>b.innerText==='bold'))};
await shot('2963-4-ticket-comment.png');
R.dialogs=dialogs;R.finalXss=await xss();
return R;
