const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records',{waitUntil:'commit'});await sleep(10000);const t=await bt();
await shot('crm-2807-c-progress.png',{timeout:90000});return (t.match(/.{0,80}(Mass update|mass update|in progress|of 60|done).{0,160}/i)||[])[0]||t.slice(0,300);
