out.loaded=await openTicket();
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|wrote:/);await page.waitForTimeout(2000);
out.prefilledRecipients=(await body()).includes('Add a recipient')?'empty':'filled';
const ed=page.locator('[contenteditable=true]').first();await ed.click();await page.keyboard.press('Control+Home');await page.keyboard.type('QA FT 1865 H reply 1: test reply for NDC-1865, please ignore.');await page.keyboard.press('Enter');
const ri=page.locator('input[placeholder="Add a recipient"]').first();await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1500);
const t0=Date.now();while(Date.now()-t0<20000&&!calls.some(c=>/draft/i.test(c)))await page.waitForTimeout(1000);out.draftCallAfterMs=Date.now()-t0;
await shot('r1-composer-ready');
const b=await body();const seg=b.slice(b.indexOf('Recipients'),b.indexOf('Subject'));out.recipientsSeg=seg.replace(/\n/g,' | ').slice(0,200);
if(!/mmohamed@anyware\.software/.test(seg)||/other|@(?!anyware)/.test(seg.replace('mmohamed@anyware.software',''))){out.abort='recipient check failed';return Object.assign(out,{calls:[...new Set(calls)]});}
await page.locator('button:text-is("Send")').first().click();await page.waitForTimeout(10000);
log('SENT reply 1 on ticket #2484 (5254adb3) To mmohamed@anyware.software From Tech <tech@help-staging.anyware.software>, subject "Re: QA FT 1865 H reply check"');
out.afterSend=await lines(/QA FT 1865 H reply 1|CONVERSATION|Not delivered|Sent|Delivered|failed|queued/i,12);await shot('r2-after-send');
return Object.assign(out,{calls:[...new Set(calls)]});
