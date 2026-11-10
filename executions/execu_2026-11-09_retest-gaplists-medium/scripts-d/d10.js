const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
const L=arr((await api('GET','/modules/'+T+'/layouts')).j);
const lay=L.find(l=>JSON.stringify(l).includes('6d053183'))||L.find(l=>/standard/i.test(l.name))||L[0];
await page.setViewportSize({width:1440,height:1000});
await page.goto(H+'/settings/modules-and-fields/'+T+'/layouts/'+lay.id,{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
const f=page.locator('main').getByText('Skills',{exact:true});await f.first().waitFor({timeout:90000}).catch(()=>{});const n=await f.count();
let out={layouts:L.length,lay:lay.name,n};
if(n){const el=f.first();await el.scrollIntoViewIfNeeded();await el.hover();await page.waitForTimeout(800);
 const fo=page.getByRole('button',{name:/field options/i});out.fo=await fo.count();
 // pick the options button nearest to the Skills label
 const bb=await el.boundingBox();let best=null,bd=1e9;for(let i=0;i<out.fo;i++){const b=await fo.nth(i).boundingBox();if(!b)continue;const d=Math.abs(b.y-bb.y);if(d<bd){bd=d;best=i;}}
 if(best!==null){await fo.nth(best).click();await page.waitForTimeout(1200);await page.screenshot({path:'../ndc-2805/evidence/raw/skills-fo-click.png'});out.menu=await page.locator('[role=menuitem],[role=menu] *,[data-radix-popper-content-wrapper] *').allInnerTexts().then(a=>[...new Set(a)].slice(0,15));
  const ep=page.getByText(/edit properties/i);if(await ep.count()){await ep.click();await page.waitForTimeout(150);await page.screenshot({path:'../ndc-2805/evidence/raw/skills-props-150ms.png'});await page.waitForTimeout(3500);
   const dlg=page.locator('[role=dialog]').last();out.general=(await dlg.innerText()).slice(0,1500);await page.screenshot({path:'../ndc-2805/evidence/raw/skills-props-general.png'});
   for(const tab of ['VALIDATION','ADVANCED']){const t=dlg.getByRole('tab',{name:new RegExp(tab,'i')});if(await t.count()){await t.click();await page.waitForTimeout(150);await page.screenshot({path:'../ndc-2805/evidence/raw/skills-props-'+tab.toLowerCase()+'-150ms.png'});await page.waitForTimeout(2500);out[tab]=(await dlg.innerText()).slice(0,1500);await page.screenshot({path:'../ndc-2805/evidence/raw/skills-props-'+tab.toLowerCase()+'.png'});}}
  }}}
return out;
