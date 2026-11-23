await page.goto(H+'/settings/web-forms',{waitUntil:'commit'});await sleep(15000);log(page.url());
const t=(await text()).replace(/\s+/g,' ');log(t.slice(0,600));await shot('3138-crm-forms-list.png');
const row=page.getByText('QA RT24 3138 crm empty').first();if(await row.count()){await row.click();await sleep(8000);log('opened',page.url());const e=page.getByText(/Embed|Add it to your website/i).first();if(await e.count()){await e.click();await sleep(4000);}
await shot('3138-crm-embed.png');log((await text()).replace(/\s+/g,' ').match(/.{0,300}(any website|Websites the form is on).{0,400}/i)?.[0]);}
