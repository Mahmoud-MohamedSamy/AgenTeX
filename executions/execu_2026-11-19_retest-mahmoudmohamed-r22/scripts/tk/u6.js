const ID=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8')).t3064;
await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(14000);
await shot('3064-1-ticket.png');
await page.getByRole('button',{name:/^Edit$/}).first().click();await sleep(5000);
log('url',page.url().replace(H,''));log('dlg',await dlg());
await shot('3064-2-edit-open.png');
await page.keyboard.press('Escape');await sleep(1500);
if(!page.url().includes(ID)){await page.goto(H+'/views/all/tickets/'+ID,{waitUntil:'domcontentloaded'});await sleep(12000);}
await page.getByRole('button',{name:/Add contact/}).first().click();await sleep(3000);
log('dlg2',await dlg());await shot('3064-3-add-contact.png');
