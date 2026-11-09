// 8 Nov H-13: delete the in-use QA skill type "QA AS6 Type" in the UI and read the message (expected: refused)
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const S='../screenshots/';await page.setViewportSize({width:1600,height:1000});
const net=[];page.on('response',async r=>{if(r.url().includes('/desk/skill-types')&&r.request().method()==='DELETE'){let t='';try{t=(await r.text()).slice(0,300)}catch(e){}net.push(r.status()+' '+t);}});
const txt=async()=> (await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/customization/skills?tab=skill-types',{waitUntil:'commit',timeout:180000});
for(let i=0;i<60;i++){await page.waitForTimeout(3000);if(/QA AS6 Type3/.test(await txt()))break;}
const tb=await page.getByText('QA AS6 Type',{exact:true}).first().boundingBox();o.row=tb;const all=page.locator('main button, button');const n=await all.count();let pick=null;for(let i=0;i<n;i++){const b=await all.nth(i).boundingBox().catch(()=>null);if(b&&tb&&Math.abs((b.y+b.height/2)-(tb.y+tb.height/2))<14&&(!pick||b.x>pick.x))pick={i,x:b.x,label:await all.nth(i).getAttribute('aria-label')};}o.pick=pick;if(pick)await all.nth(pick.i).click({timeout:15000});await page.waitForTimeout(2500);
o.confirm=(await page.locator('[role=dialog],[role=alertdialog]').first().innerText().catch(()=>'')).replace(/\s+/g,' ');
await page.screenshot({path:S+'ev-H13-tavi-delete-confirm.png'});
const del=page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/delete/i}).last();
if(await del.count()){await del.click({timeout:15000});await page.waitForTimeout(4000);}
o.after=(await txt()).match(/.{0,200}(could not|cannot|can't|in use|used by|associated).{0,200}/i)?.[0]||'(no message text found)';
await page.screenshot({path:S+'ev-H13-tavi-delete-result.png'});
o.net=net;o.stillThere=/QA AS6 Type QA AS6 Type3|QA AS6 Type\b/.test(await txt());
o.types=(await api('GET','/desk/skill-types')).j.data.types.map(t=>t.name);
return o;
