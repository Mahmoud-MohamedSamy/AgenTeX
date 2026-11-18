await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});
await page.getByText('Workflow Rules').first().waitFor({timeout:150000});await sleep(5000);
const links=await page.$$eval('a',as=>as.filter(a=>/execution|histor/i.test(a.href+' '+a.innerText)).map(a=>({href:a.getAttribute('href'),t:a.innerText.trim().slice(0,60)})));log('links',links);
const btns=await page.$$eval('button,[role=menuitem],[role=tab]',as=>as.filter(a=>/execution|histor/i.test(a.innerText+' '+(a.getAttribute('aria-label')||'')+' '+(a.title||''))).map(a=>a.outerHTML.slice(0,200)));log('btns',btns);
const side=await page.$$eval('nav a, aside a',as=>as.map(a=>a.innerText.trim()).filter(Boolean));log('side',side.join(' | '));
