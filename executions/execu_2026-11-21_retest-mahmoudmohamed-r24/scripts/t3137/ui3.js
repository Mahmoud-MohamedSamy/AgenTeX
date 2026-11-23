await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.getByText('Round Robin',{exact:true}).first().waitFor({timeout:120000});
await page.getByText('Round Robin',{exact:true}).first().click();await sleep(5000);
log((await text()).replace(/\s+/g,' ').slice(0,1200));await shot('3137-c-rr-tab.png');
