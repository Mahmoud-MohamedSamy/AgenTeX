await go('/settings/customization/notifications');await sleep(9000);
await page.locator('select').first().selectOption({label:'QA AS6 Dept A'});await sleep(5000);
const h=page.getByText('Closing a ticket',{exact:true}).first();await h.scrollIntoViewIfNeeded();await page.mouse.wheel(0,250);await sleep(1500);await shot('e1ev-notif-dA');
const b=await h.boundingBox();log('box',b);
await go('/settings/organization/customer-happiness');await sleep(8000);await shot('e1ev-happy');
return {ok:1};
