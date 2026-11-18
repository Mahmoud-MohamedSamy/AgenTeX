await page.goto(H+'/views/all/tickets/f0ccb075-4a50-448d-823b-67e1bfca6354',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Edit Skills'}).waitFor({state:'attached',timeout:90000});await sleep(4000);
await page.getByRole('button',{name:'More ticket actions'}).click();await sleep(1200);
await page.getByRole('menuitem',{name:/Assign by Skills/i}).click();await sleep(1500);
log('toast '+((await text()).match(/[^\n]*(skill|assigned)[^\n]*/gi)||[]).slice(-4).join(' || '));
await shot('2931-4-ui-assign-by-skills-done.png');await sleep(3000);
const o=page.getByText(/^Ticket Owner/).first();log('owner block '+(await o.evaluate(e=>e.parentElement.parentElement.innerText)).replace(/\n/g,' | ').slice(0,200));
await shot('2931-5-ui-assign-by-skills-owner.png');
