const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const D='../ndc-2628/evidence/raw/';const o={};
const blocked=[];await page.route('**/api/v1/**',q=>{const m=q.request().method();const u=q.request().url();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime|search|query|list|filter|count|preview/.test(u)){blocked.push(m+' '+u.split('/api/v1')[1].slice(0,90));return q.abort();}return q.continue();});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L,{waitUntil:'load',timeout:120000});await page.getByRole('button',{name:'Module actions'}).waitFor({timeout:90000});await page.waitForTimeout(2500);
const ex=page.getByText('Exit sheet view');o.sheetOn=await ex.count();if(o.sheetOn){await ex.first().click();await page.waitForTimeout(1500);o.sheetOff=!(await page.getByText('Exit sheet view').count());}
// print view
const pop=page.context().waitForEvent('page',{timeout:8000}).catch(()=>null);
await page.getByRole('button',{name:'Module actions'}).click();await page.waitForTimeout(800);await page.getByRole('menuitem',{name:'Print View'}).click();await page.waitForTimeout(4000);
const p=await pop;o.printPopup=p?p.url().replace(H,'').slice(0,100):null;o.printUrl=page.url().replace(H,'').slice(0,100);
if(p){await p.waitForTimeout(4000);await p.screenshot({path:D+'act-print-view.png'}).catch(()=>{});o.printText=(await p.locator('body').innerText().catch(()=>'')).slice(0,200);await p.close();}else{await page.screenshot({path:D+'act-print-view.png'});o.printText=(await page.locator('body').innerText()).split('\n').filter(l=>/print/i.test(l)).slice(0,5);}
await page.goto(H+'/modules/'+L,{waitUntil:'load',timeout:120000});await page.getByRole('button',{name:'Module actions'}).waitFor({timeout:90000});await page.waitForTimeout(2500);
// system filters
await page.getByRole('button',{name:'Open filter sidebar'}).click();await page.waitForTimeout(2500);
o.sys={};
for(const f of ['Activities','Latest email status','Locked','Record action','Related records action','Touched records','Untouched records']){
 const el=page.getByText(f,{exact:true}).first();await el.click().catch(()=>{});await page.waitForTimeout(1500);
 const t=(await page.locator('body').innerText()).split('\n').map(s=>s.trim());const i=t.indexOf(f);
 o.sys[f]={soon:/coming soon/i.test(t.slice(i,i+15).join(' ')),after:t.slice(i+1,i+7).filter(Boolean)};
 if(f==='Locked'){await page.screenshot({path:D+'sysfilter-locked.png'});}
 await el.click().catch(()=>{});await page.waitForTimeout(600);}
o.sysMissing=['Campaigns','Cadences'].filter(async x=>true);
const side=(await page.locator('body').innerText());o.hasCampaigns=/\bCampaigns\b/.test(side);o.hasCadences=/Cadences/.test(side);
// field filter + save as view
const own=page.getByText('Full Name',{exact:true}).first();await own.click();await page.waitForTimeout(1500);
await page.screenshot({path:D+'filter-fullname.png'});
const inp=page.locator('input:visible').filter({hasNot:page.locator('[placeholder*=Search]')});
const box=page.getByPlaceholder(/type|value|enter/i).first();if(await box.count()){await box.fill('QA RT 2628');await page.waitForTimeout(800);}
const apply=page.getByRole('button',{name:/apply filter|^apply$/i});o.apply=await apply.count();if(o.apply){await apply.first().click();await page.waitForTimeout(4000);}
await page.screenshot({path:D+'filter-applied.png'});
const b2=await page.locator('button:visible').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText.trim()).slice(0,40)).filter(t=>/save|view/i.test(t)));o.saveViewBtns=[...new Set(b2)];
o.blocked=blocked;return o;
