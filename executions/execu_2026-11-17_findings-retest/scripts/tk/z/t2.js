const RAW='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/screenshots/raw/';
const M=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
module.exports=async(page,z)=>{const o={};const ID='1499272000000468001';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/'+ID,{waitUntil:'commit'});
for(let k=0;k<30;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(t.includes('#106'))break;}
await page.waitForTimeout(3000);for(let i=0;i<2;i++){const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});await page.keyboard.press('Escape');await page.waitForTimeout(600);}
await page.mouse.click(1517,80);await page.waitForTimeout(2000);
o.menu=M((await page.innerText('body')).replace(/\s+/g,' ')).match(/(Clone|Merge|Print|Spam|Delete|Move)[^]{0,0}/g);
await page.screenshot({path:RAW+'F13-Z-2-menu.png'});
const cl=page.getByText('Clone',{exact:true});o.cloneCount=await cl.count();
if(o.cloneCount){await cl.first().click();await page.waitForTimeout(8000);o.t=new Date().toISOString().slice(11,19);o.url=page.url().replace(/\d{10,}/g,'<id>');
 const body=M((await page.innerText('body')).replace(/\s+/g,' '));const i=body.indexOf('Ticket Owner');o.owner=i<0?'(none)':body.slice(i,i+120);
 const lb=page.getByText('Ticket Owner',{exact:true});o.ownerBoxes=await lb.evaluateAll(es=>es.filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y)];}));
 if(o.ownerBoxes.length){await lb.last().scrollIntoViewIfNeeded().catch(()=>{});await page.waitForTimeout(1000);o.ownerBoxes2=await lb.evaluateAll(es=>es.filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y)];}));}
 o.emails=await page.locator('text=/[\w.+-]+@[\w-]+\.[\w.]+/').evaluateAll(es=>es.filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)];}));
 o.inputs=await page.locator('input').evaluateAll(es=>es.filter(e=>e.offsetParent&&/@/.test(e.value)).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)];}));
 await page.screenshot({path:RAW+'F13-Z-3-clone-form.png'});
 const c=page.getByRole('button',{name:/^Cancel$/});o.cancel=await c.count();if(o.cancel)await c.last().click().catch(()=>{});else await page.keyboard.press('Escape');await page.waitForTimeout(2500);
 const d=page.getByText(/Discard|Leave/);if(await d.count()){o.discard=await d.first().innerText();await d.first().click().catch(()=>{});}
 await page.waitForTimeout(2000);o.after=page.url().replace(/\d{10,}/g,'<id>');}
const s=await z('GET','/api/v1/tickets/search?subject='+encodeURIComponent('test ticket 03')+'&limit=10');o.search=s.s+' '+(s.j?.data||[]).map(x=>x.ticketNumber+':'+x.subject).join(',');
return o;};
