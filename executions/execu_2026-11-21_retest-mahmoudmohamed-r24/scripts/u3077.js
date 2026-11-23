const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/d4c603ea-874f-458c-a950-03446bf34202',{waitUntil:'commit'});await page.getByText('#5689').first().waitFor({timeout:120000});await sleep(5000);
await page.getByText(/^History$/i).first().click();await sleep(6000);const t=await bt();const j=t.indexOf('Ticket History');await shot('3077-r1-a-history.png',{timeout:90000});return t.slice(j,j+900);
