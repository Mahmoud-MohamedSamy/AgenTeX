const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const D='../ndc-2628/evidence/raw/';const o={};
const blocked=[];await page.route('**/api/v1/**',q=>{const m=q.request().method();const u=q.request().url();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query|list|filter|count|preview/.test(u)){blocked.push(m+' '+u.split('/api/v1')[1].slice(0,90));return q.abort();}return q.continue();});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L,{waitUntil:'load',timeout:120000});await page.getByRole('button',{name:'Module actions'}).waitFor({timeout:90000});await page.waitForTimeout(2500);
await page.getByRole('button',{name:'Open filter sidebar'}).click();await page.waitForTimeout(2000);
await page.getByText('Full Name',{exact:true}).first().click();await page.waitForTimeout(1000);
await page.getByPlaceholder('Filter by full name…').fill('QA RT 2628');await page.waitForTimeout(1500);
const bs=await page.locator('button:visible').evaluateAll(b=>b.filter(x=>x.getBoundingClientRect().x<530).map(x=>(x.getAttribute('aria-label')||x.innerText.trim()).slice(0,40)).filter(Boolean));o.sideBtns=[...new Set(bs)].slice(-15);
const ap=page.getByRole('button',{name:/^apply/i});if(await ap.count()){await ap.first().click();await page.waitForTimeout(4000);}
await page.screenshot({path:D+'filter-applied.png'});
const all=await page.locator('button:visible, a:visible').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText.trim()).slice(0,40)).filter(t=>/save/i.test(t)));o.saveBtns=[...new Set(all)];
o.records=(await page.locator('body').innerText()).match(/[\d,]+ records/g);
// import page
await page.getByRole('button',{name:'Module actions'}).click();await page.waitForTimeout(800);await page.getByRole('menuitem',{name:'Import Leads'}).click();await page.waitForTimeout(6000);
o.importUrl=page.url().replace(H,'');await page.screenshot({path:D+'import.png'});
const it=(await page.locator('body').innerText()).split('\n').filter(l=>/approv|review|manual|coming soon/i.test(l));o.importLines=it.slice(0,10);
o.blocked=blocked;return o;
