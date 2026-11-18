// 2971 evidence: QA SK13 WF skills editor, Add skills list (read-only, Cancel, nothing saved)
await page.goto(H+'/settings/automation/workflow-rules/11577372-a189-4557-9139-8fd080a15331',{waitUntil:'domcontentloaded'});await sleep(9000);
const lab=page.getByText('QA SK13 Inact (removed)').first();await lab.scrollIntoViewIfNeeded();await sleep(800);
const card=page.locator('div').filter({has:page.getByText('Configure inline')}).filter({has:page.getByText('QA SK13 Inact (removed)')}).last();
const bb=await card.boundingBox();log('card '+JSON.stringify(bb));
await shot('2971-1-wf-add-skills-list.png');
const opts=await page.locator('label').allInnerTexts();log('labels '+JSON.stringify(opts.filter(x=>/QA|skill|tier|billing/i.test(x)).slice(0,60)));
