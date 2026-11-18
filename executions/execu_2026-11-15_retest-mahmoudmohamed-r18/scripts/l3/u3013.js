const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=validation',{waitUntil:'domcontentloaded'}); await sleep(9000);
const m=(await page.locator('main').last().innerText()); const i=m.indexOf('Rule\nLayout'); log('list', m.slice(m.indexOf('Actions',i>0?i:0), m.indexOf('Actions',i>0?i:0)+900).replace(/\n+/g,' | '));
await page.getByText('QA NDC Reject needs a reason',{exact:true}).first().scrollIntoViewIfNeeded(); await shot('3013-1-list.png');
await page.getByText('QA NDC Reject needs a reason',{exact:true}).first().click(); await sleep(5000);
log('url',page.url().replace(H,'')); const d=page.locator('[role=dialog]').last(); const t=(await d.count())?await d.innerText():(await page.locator('main').last().innerText()).split('Email Providers').pop(); log('editor', t.replace(/\s+/g,' ').slice(0,1500));
await shot('3013-2-editor.png');
