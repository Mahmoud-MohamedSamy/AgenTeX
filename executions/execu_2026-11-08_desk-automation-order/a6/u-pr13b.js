// OR-13 evidence: Round Robin list in QA AS6 Dept A, then the rule's edit form.
await go('/settings/automation/assignment-rules');await sleep(8000);
await page.mouse.click(467,202);await sleep(4000);
await page.mouse.click(1380,358);await sleep(1500);
const o=page.getByRole('option',{name:/QA AS6 Dept A/}).first();if(await o.count())await o.click();else{await page.getByText('QA AS6 Dept A',{exact:true}).last().click();}await sleep(5000);
await shot('pr13-rr-list');
const row=page.locator('div').filter({hasText:/OR13 RR on SLA name/}).last();log('row',await row.count());
const box=await page.getByText(/OR13 RR on SLA name/).first().boundingBox();log('box',box);
if(box){await page.getByText(/OR13 RR on SLA name/).first().scrollIntoViewIfNeeded();await sleep(800);const b2=await page.getByText(/OR13 RR on SLA name/).first().boundingBox();await page.getByText(/OR13 RR on SLA name/).first().evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await sleep(800);await page.mouse.click(1493,812);await sleep(6000);}
await shot('pr13-rule');log('rule',(await text()).replace(/\s+/g,' ').slice(1500,3500));
return {url:page.url()};
