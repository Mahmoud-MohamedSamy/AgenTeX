await page.goto(H+'/reports/55428e5a-7143-45e8-992a-b33bc99bca89',{waitUntil:'domcontentloaded'}); await sleep(15000);
log('url',page.url()); const t=await text(); log('has', ['Silver Star','Silver','Gold'].map(k=>k+':'+(t.split(k).length-1)));
log(t.slice(t.indexOf('QA RT17'),t.indexOf('QA RT17')+600));
await shot('2917-report-ui.png');
await page.goto(H+'/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3?view=53653f38-0571-42bd-a70e-eb9cd5de9448',{waitUntil:'domcontentloaded'}); await sleep(12000);
log('url2',page.url()); const t2=await text(); log('view has', (t2.match(/2867 Gold [AB]/g)||[]), t2.includes('QA RT17 2867 Gold view'));
await shot('2867-view-ui.png');
return {};
