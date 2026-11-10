const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
const L=arr((await api('GET','/modules/'+T+'/layouts')).j);const lay=L.find(l=>/QA NDC Accounting/.test(l.name))||L[0];
await page.setViewportSize({width:1440,height:1000});
await page.goto(H+'/settings/modules-and-fields/'+T+'/layouts/'+lay.id,{waitUntil:'load',timeout:120000});
const f=page.locator('main').getByText('Skills',{exact:true});await f.first().waitFor({timeout:90000});await page.waitForTimeout(3000);
const el=f.first();await el.scrollIntoViewIfNeeded();await el.hover();await page.waitForTimeout(800);
const fo=page.getByRole('button',{name:/field options/i});const bb=await el.boundingBox();let best=0,bd=1e9;const c=await fo.count();for(let i=0;i<c;i++){const b=await fo.nth(i).boundingBox();if(!b)continue;const d=Math.abs(b.y-bb.y);if(d<bd){bd=d;best=i;}}
await fo.nth(best).click();await page.waitForTimeout(1200);
const before=await page.locator('body').innerText();
await page.getByText(/^Edit Properties$/).click();
const shots=[];for(const ms of [100,300,700]){await page.waitForTimeout(ms);const p='../ndc-2805/evidence/raw/props-t'+ms+'.png';await page.screenshot({path:p});shots.push(p);}
await page.waitForTimeout(3000);await page.screenshot({path:'../ndc-2805/evidence/raw/props-general.png'});
const after=await page.locator('body').innerText();const bl=new Set(before.split('\n'));const newLines=after.split('\n').filter(l=>!bl.has(l)).slice(0,60);
const out={newLines};
for(const tab of ['VALIDATION','PERMISSIONS','ADVANCED']){const t=page.getByRole('tab',{name:new RegExp('^'+tab+'$','i')});if(await t.count()){await t.first().click();await page.waitForTimeout(120);await page.screenshot({path:'../ndc-2805/evidence/raw/props-'+tab.toLowerCase()+'-120ms.png'});await page.waitForTimeout(3000);await page.screenshot({path:'../ndc-2805/evidence/raw/props-'+tab.toLowerCase()+'.png'});const a2=await page.locator('body').innerText();out[tab]=a2.split('\n').filter(l=>!bl.has(l)).slice(0,40);}}
return out;
