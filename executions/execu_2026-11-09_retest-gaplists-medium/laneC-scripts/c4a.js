await page.setViewportSize({width:1440,height:900});
await page.route('**/api/v1/**',r=>r.request().method()!=='GET'&&!/query|search|lookup/i.test(r.request().url())?r.abort():r.continue());
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
await page.getByRole('button',{name:/Add Activity/i}).first().click();await page.waitForTimeout(1200);
await page.getByRole('menuitem',{name:/Task/i}).first().click();await page.waitForTimeout(3000);
return await page.evaluate(()=>{const lab=[...document.querySelectorAll('label,span,div')].filter(e=>/^(Department|Task Owner)\*?$/.test(e.innerText.trim()));return lab.slice(0,4).map(l=>{let p=l.parentElement;for(let i=0;i<2&&p;i++)p=p.parentElement;return p.outerHTML.replace(/class="[^"]*"/g,'').slice(0,1200)})});
