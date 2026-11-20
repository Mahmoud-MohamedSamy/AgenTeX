await page.goto(H+'/views/all/tickets/da96e91b-3f0c-4c56-a4ba-7fb13a52055a',{waitUntil:'commit'});await page.getByText('QA RT20 W2 2997 rapid t1').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
await page.getByText('History',{exact:true}).first().click();await sleep(6000);
const el=page.getByText('Ticket owner was changed').first();await el.scrollIntoViewIfNeeded();await page.mouse.move(1100,500);await page.mouse.wheel(0,-120);await sleep(1500);
const bb=await el.boundingBox();const bb2=await page.getByText('Ticket Owner was updated').first().boundingBox();
await shot('2997-r2-ticket-history-dup.png');return {bb,bb2};
