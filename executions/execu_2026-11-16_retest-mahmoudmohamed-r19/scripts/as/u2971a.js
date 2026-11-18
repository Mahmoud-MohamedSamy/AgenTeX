// explore: open existing workflow rule "QA SK13 WF skills" (read-only), find Add skills action
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await sleep(8000);
const s=page.getByPlaceholder(/search/i).first();if(await s.count()){await s.fill('QA SK13 WF skills');await sleep(2500);}
const row=page.getByText('QA SK13 WF skills',{exact:true}).first();log('row count '+await row.count());
await row.click();await sleep(7000);log('url '+page.url());
const t=(await text()).replace(/\s+/g,' ');log(t.slice(0,2500));
await shot('2971-x-wf-open.png',{fullPage:true});
