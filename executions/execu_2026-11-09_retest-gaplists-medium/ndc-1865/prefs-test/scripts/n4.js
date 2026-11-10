await page.setViewportSize({width:1280,height:900});
await page.goto(H+'/settings/integrations/crm',{waitUntil:'commit',timeout:120000});await wt(/Parked/);
await page.getByText('Configuration Details',{exact:true}).first().click();await wt(/Preferences/);await page.waitForTimeout(2500);
const btn=page.locator('button',{hasText:'Never delete the corresponding CRM contact'}).first();await btn.scrollIntoViewIfNeeded();await btn.click();await page.waitForTimeout(1500);
out.popup=await page.evaluate(()=>{const els=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/Delete the corresponding CRM contact/.test(e.textContent||''));return els.map(e=>{let p=e,chain=[];for(let i=0;i<4&&p;i++){chain.push(p.tagName+'['+(p.getAttribute('role')||'')+']');p=p.parentElement;}return chain.join('<');});});
await shot('p3-desk-contact-dropdown-open');await page.keyboard.press('Escape');
return out;
