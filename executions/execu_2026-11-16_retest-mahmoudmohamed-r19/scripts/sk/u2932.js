await page.goto(H+'/views/all/tickets/baec2abc-8101-49ab-ba22-e344377c966a',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Edit Skills'}).waitFor({state:'attached',timeout:90000});await sleep(4000);
const o=page.getByText(/^Ticket Owner/).first();log('owner '+(await o.evaluate(e=>e.parentElement.parentElement.innerText)).replace(/\n/g,' | ').slice(0,120));
log('skills row '+(await page.getByRole('button',{name:'Edit Skills'}).innerText()).replace(/\n/g,' | '));
await page.getByText(/^HISTORY$/i).first().click();await sleep(4000);
log('history '+(await page.locator('main, body').last().innerText()).split('HISTORY').pop().replace(/\n+/g,' | ').slice(0,700));
await shot('2932-1-ticket-no-skills-history.png');
