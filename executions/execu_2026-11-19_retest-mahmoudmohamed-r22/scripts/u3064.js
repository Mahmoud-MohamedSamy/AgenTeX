const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/c2cacd94-4c69-4693-a58b-e1cbf5918e0d',{waitUntil:'commit'});await page.getByText('#5690').first().waitFor({timeout:120000});await sleep(5000);
await page.getByRole('button',{name:/^Edit$/}).first().click({timeout:15000});await sleep(3000);let t=await bt();R.form=(t.match(/.{0,60}(Edit ticket|Save|Cancel).{0,300}/)||[])[0];await shot('3064-r1-a-edit-form.png',{timeout:90000});
R.labels=(await page.locator('[role=dialog] label, form label').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(0,30);
return R;
