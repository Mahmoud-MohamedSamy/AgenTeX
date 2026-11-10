const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
const L=arr((await api('GET','/modules/'+T+'/layouts')).j);const lay=L.find(l=>/QA NDC Accounting/.test(l.name))||L[0];
await page.setViewportSize({width:1440,height:1000});
await page.goto(H+'/settings/modules-and-fields/'+T+'/layouts/'+lay.id,{waitUntil:'load',timeout:120000});
const f=page.locator('main').getByText('Skills',{exact:true});await f.first().waitFor({timeout:90000});await page.waitForTimeout(3000);
const el=f.first();await el.scrollIntoViewIfNeeded();await el.hover();await page.waitForTimeout(800);
const fo=page.getByRole('button',{name:/field options/i});const bb=await el.boundingBox();let best=0,bd=1e9;const c=await fo.count();for(let i=0;i<c;i++){const b=await fo.nth(i).boundingBox();if(!b)continue;const d=Math.abs(b.y-bb.y);if(d<bd){bd=d;best=i;}}
await fo.nth(best).click();await page.waitForTimeout(1200);await page.getByText(/^Edit Properties$/).click();await page.waitForTimeout(3500);
await page.screenshot({path:'../ndc-2805/evidence/raw/props-general.png'});
const apiInput=await page.locator('input').evaluateAll(a=>a.filter(x=>x.offsetParent).map(x=>({v:x.value.slice(0,30),dis:x.disabled,ro:x.readOnly,ph:x.placeholder})));
await page.getByRole('tab',{name:/^ADVANCED$/i}).first().click();await page.waitForTimeout(3000);
// scroll the panel to bottom
await page.mouse.move(1200,600);for(let i=0;i<30;i++){await page.mouse.wheel(0,800);await page.waitForTimeout(80);}
await page.waitForTimeout(800);await page.screenshot({path:'../ndc-2805/evidence/raw/props-advanced-bottom.png'});
const t=await page.locator('body').innerText();const tail=t.split('\n').filter(l=>/max|limit|items|10|select up|choices|option/i.test(l)).slice(0,20);
const inputs=await page.locator('input,button').evaluateAll(a=>a.filter(x=>x.offsetParent&&x.getBoundingClientRect().x>980).map(x=>({tag:x.tagName,t:(x.innerText||x.value||x.getAttribute('aria-label')||'').slice(0,30),dis:x.disabled})).slice(-25));
return {apiInput,tail,inputs};
