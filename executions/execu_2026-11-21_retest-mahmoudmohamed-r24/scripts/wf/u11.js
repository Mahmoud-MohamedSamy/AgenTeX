const R={};const main=()=>page.locator('main').last();
const dialogs=[];page.on('dialog',d=>{dialogs.push(d.message());d.dismiss().catch(()=>{});});
// 2963 ticket comment
await page.goto(H+'/views/all/tickets/553b14ba-0a90-489e-93c3-7cfc4c66fd3a',{waitUntil:'domcontentloaded'});await sleep(12000);
R.ticketUrl=page.url().replace(H,'');
const c=page.getByText('QA RT19 2963 comment').first();R.found=await c.count();
if(!R.found){const tab=page.getByRole('tab',{name:/Comments|Conversations/}).first();if(await tab.count()){await tab.click();await sleep(3000);}R.found=await c.count();}
if(R.found){await c.scrollIntoViewIfNeeded();await sleep(800);}
R.ticket={xss:await page.evaluate(()=>window.__xss===undefined?'unset':window.__xss),imgs:await page.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>i.getAttribute('src')==='x').map(i=>({onerror:i.getAttribute('onerror')}))),
 anchors:await page.evaluate(()=>[...document.querySelectorAll('a')].filter(a=>a.innerText.trim()==='lnk').map(a=>a.getAttribute('href'))),
 commentText:await page.evaluate(()=>{const n=[...document.querySelectorAll('*')].filter(e=>e.innerText&&e.innerText.includes('QA RT19 2963 comment')).pop();return n?n.innerText.slice(0,200):null;}),
 commentHtml:await page.evaluate(()=>{const n=[...document.querySelectorAll('*')].filter(e=>e.innerHTML.includes('QA RT19 2963 comment')).pop();return n?n.innerHTML.slice(0,400):null;})};
await shot('2963-4-ticket-comment.png');
const ex={'2962-2-exec-injected':'9bffe277-7371-4b63-93ca-13194d4984a6','2962-3-exec-control':'a245f500-0f48-4793-8bf4-2c728aba0cce','2997-2-exec-online':'986edb07-5535-42e2-8bc3-2ce8608037c7','2973-1-exec-susp-in-dept':'91bdbf58-af0e-4b86-b9b7-73bfc4f54fdf','2973-2-exec-not-in-dept':'286da85b-4dd7-4a51-8a6d-14eda2a727a8','2966-1-exec-off':'a788e794-8100-4c88-8ef0-175bf2fbbb40','2966-2-exec-scope':'5107f54a-5b44-449c-80e3-9d4f8fdd8ea7','2968-1-exec-full':'0d44f9e7-5e8d-4484-b7ea-ce7d5320767a','2968-2-exec-empty':'afcb7545-91d1-4599-af62-3e80f5af947f'};
for(const [n,id] of Object.entries(ex)){await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'domcontentloaded'});await sleep(6000);const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.indexOf('Back to history');R[n]=page.url().replace(H,'')+' | '+(i>=0?t.slice(i,i+700):t.slice(-300));await shot(n+'.png');}
// 2968 call record
for(const p of ['/activities/calls/2372ca58-1301-4212-bda5-c438eba5c122','/views/all/calls/2372ca58-1301-4212-bda5-c438eba5c122']){await page.goto(H+p,{waitUntil:'domcontentloaded'});await sleep(9000);const t=(await main().innerText()).replace(/\s+/g,' ');R['call '+p]=page.url().replace(H,'')+' | '+t.slice(0,900);if(/2968/.test(t)){await shot('2968-3-call-record.png');break;}}
R.dialogs=dialogs;return R;
