await page.goto(H+'/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288',{waitUntil:'domcontentloaded'}); await sleep(12000);
const a=await page.locator('text="Pick List"').first().boundingBox(); const b=await page.locator('text="Company"').first().boundingBox();
await page.mouse.move(a.x+a.width/2,a.y+a.height/2); await page.mouse.down(); await sleep(300);
for(let i=1;i<=25;i++){await page.mouse.move(a.x+(b.x+200-a.x)*i/25, a.y+(b.y+6-a.y)*i/25); await sleep(40);} await sleep(500); await page.mouse.up(); await sleep(3000);
let t=await text(); const name=(t.match(/Named "([^"]+)"/)||[])[1]; if(!name) return {err:'not dropped'};
const rb=await page.locator(`text="${name}"`).first().boundingBox();
const dots=page.locator('button[aria-label="Field options"]'); const ys=await dots.evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y)); const idx=ys.findIndex(y=>Math.abs(y-rb.y)<30); await dots.nth(idx).click(); await sleep(1000);
await page.getByText(/Edit Properties/).first().click(); await sleep(2500);
const panel=page.locator('text=Field Properties').locator('xpath=ancestor::*[.//button[normalize-space()="Apply"]][1]');
// General: label
const lab=panel.locator('input').first(); await lab.fill('QA RT17 2865 UI'); await sleep(500);
await shot('2865-3-general.png');
await panel.getByText(/^Advanced$/i).first().click(); await sleep(1500);
const sel=panel.locator('select').first(); let picked='';
{ await panel.getByText('Use a global set').first().click(); await sleep(1000); await shot('2865-4-gsmenu.png'); await page.getByText('QA RT17 GS Tier',{exact:true}).last().click(); picked='custom'; }
await sleep(2000); await shot('2865-5-picked.png'); log('picked',picked, (await panel.innerText()).slice(0,700));
await panel.getByRole('button',{name:'Apply'}).click(); await sleep(2000); await shot('2865-6-applied.png');
const resp=[]; page.on('response',async r=>{ if(/\/modules\/.*\/(layouts|fields)/.test(r.url())&&r.request().method()!=='GET'){ resp.push(r.request().method()+' '+r.url().replace(H,'').slice(0,120)+' '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); }});
await page.getByRole('button',{name:'Save',exact:true}).click(); await sleep(8000);
await shot('2865-7-saved.png'); t=await text(); log('after save toasts', (t.match(/(saved|error|not supported|failed)[^\n]{0,160}/ig)||[]).slice(0,5));
log('responses',resp);
return {name};
