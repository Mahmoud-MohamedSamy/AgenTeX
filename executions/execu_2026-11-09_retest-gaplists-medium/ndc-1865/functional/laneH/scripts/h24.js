let step='nav';try{
await page.goto(H+'/hq',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
await page.mouse.click(30,137);await page.waitForTimeout(8000);out.url=page.url();
out.feed=(await body()).split('\n').slice(0,40);await shot('f1-team-feeds');
const inputs=await page.locator('textarea, [contenteditable=true], input[type=text]').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.getAttribute('placeholder')||e.getAttribute('aria-label')||'')));out.inputs=inputs;
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('f-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
