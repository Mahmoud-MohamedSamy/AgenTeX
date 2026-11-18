await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'domcontentloaded'});await sleep(8000);
await page.getByRole('link',{name:/^Skills$/}).first().click().catch(async()=>{await page.getByText(/^Skills$/).first().click();});await sleep(8000);
log('url '+page.url());
const t=(await text()).replace(/\s+/g,' ');log('hits '+JSON.stringify((t.match(/[^.]{0,250}(round robin|Assign by Skills|at least one|any of)[^.]{0,250}/gi)||[]).slice(0,6)));
const f=page.getByText(/at least one|any of the ticket|any one of/i).first();if(await f.count()){await f.scrollIntoViewIfNeeded();await sleep(600);log('box '+JSON.stringify(await f.boundingBox()));}
await shot('2931-1-setup-skills-help.png');
