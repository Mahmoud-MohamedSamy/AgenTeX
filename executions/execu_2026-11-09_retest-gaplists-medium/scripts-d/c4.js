const fs=require('fs');const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const {L,R}=I;const D='../ndc-2628/evidence/raw/';const o={};
const reqs=[];page.on('request',q=>{const u=q.url();if(u.includes('/api/v1/')&&!u.includes('/iam/auth')&&q.method()!=='GET')reqs.push(q.method()+' '+u.split('/api/v1')[1].slice(0,140));});
await page.setViewportSize({width:1440,height:950});
const ser=await page.evaluate(()=>location.href);
// find record page route
const urls=['/modules/'+L+'/records/'+R,'/leads/'+R,'/crm/leads/'+R];
for(const u of urls){await page.goto(H+u,{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);if(/QA RT 2628 Lead/.test(await page.locator('body').innerText())){o.route=u;break;}}
await page.screenshot({path:D+'record.png'});
// record menu
const more=page.getByRole('button',{name:/more|actions|record actions/i});o.moreBtns=await more.evaluateAll(b=>b.map(x=>x.getAttribute('aria-label')||x.innerText.trim()).slice(0,8));
for(let i=0;i<await more.count();i++){const b=more.nth(i);const bb=await b.boundingBox();if(bb&&bb.y<200){await b.click();await page.waitForTimeout(1500);o.menu=await page.locator('[role=menuitem]').allInnerTexts();await page.screenshot({path:D+'record-menu.png'});await page.keyboard.press('Escape');break;}}
// notes tab
const nt=page.getByRole('tab',{name:/notes/i});if(await nt.count()){await nt.first().click();await page.waitForTimeout(4000);}
const note=page.getByText('platypusnote').first();o.noteVisible=await note.count();
if(o.noteVisible){await note.scrollIntoViewIfNeeded();await note.hover();await page.waitForTimeout(800);await page.screenshot({path:D+'note-hover.png'});
 const nb=await page.locator('button:visible').evaluateAll(b=>b.map(x=>x.getAttribute('aria-label')||x.innerText.trim()).filter(t=>/edit|delete|note|more|action/i.test(t)).slice(0,15));o.noteBtns=nb;}
o.reqs=reqs;return o;
