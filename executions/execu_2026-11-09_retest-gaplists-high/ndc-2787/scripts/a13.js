const out={};await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/views/all/tickets/617328b7-0b3c-4230-be13-1437c609d88b',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
const rail=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.x>320&&r.x<365&&r.y>60&&r.y<400}).map(b=>({a:b.getAttribute('aria-label'),t:b.getAttribute('title'),y:Math.round(b.getBoundingClientRect().y+b.getBoundingClientRect().height/2)})));
out.rail=rail;
for(const [k,r] of rail.entries()){await page.mouse.click(341,r.y);await page.waitForTimeout(4000);const t=await page.locator('body').innerText();const m=t.match(/(Ticket Properties|AI assist|Related[^\n]*|Linked[^\n]*|Similar[^\n]*|History[^\n]*|Customer[^\n]*)/);out['panel'+k]=t.split('\n').filter(s=>s.trim()).slice(0,0).join('');
 const head=await page.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>{const r=x.getBoundingClientRect();return r.x>370&&r.x<400&&r.y>65&&r.y<95&&x.children.length===0&&x.innerText&&x.innerText.trim()});return e&&e.innerText.trim()});
 const panel=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(x=>{const r=x.getBoundingClientRect();return r.x>365&&r.x<660&&r.y>60&&r.y<700&&x.children.length===0&&x.innerText&&x.innerText.trim()}).map(x=>x.innerText.trim()).slice(0,25).join(' | '));
 out['rail'+k]={head,panel};await page.screenshot({path:'evidence/raw/rail-'+k+'.png'});}
await page.goto(H+'/settings/channels/help-center/languages',{waitUntil:'load',timeout:120000});await page.waitForTimeout(15000);
const t=await page.locator('body').innerText();const i=t.indexOf('Default language');out.hcl=t.slice(Math.max(0,t.indexOf('Languages',t.indexOf('Customization'))),).replace(/\n+/g,' | ').slice(0,1500);await page.screenshot({path:'evidence/raw/hc-languages.png'});
return out;
