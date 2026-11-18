const out={};
await page.goto(H+'/views/all/tickets/ca675941-80ec-4595-a9f1-b095c31dbc3b',{waitUntil:'domcontentloaded'}); await sleep(15000);
out.open=(await page.locator('main').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,400);
await shot('3045-1-agentC-open-4067.png');
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d',{waitUntil:'domcontentloaded'}); await sleep(14000);
const t=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
out.list={has4067:/QA RT18 3045 B1/.test(t), has4068:/QA RT18 3045 B2/.test(t), hasOwn:/QA RT18 3045 CS owned by C/.test(t), head:t.slice(0,300)};
await shot('3045-2-agentC-list.png');
return out;
