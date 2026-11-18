const IDS=JSON.parse(require('fs').readFileSync('ac/ids.json','utf8'));
await page.goto(H+'/views/all/tickets/'+IDS.T7,{waitUntil:'domcontentloaded'}); await sleep(14000); await shot('A7-1-d-on-e-ticket.png');
log((await text()).match(/[^\n]*(QA RT21 AC A7|read|Permission|not available)[^\n]*/gi)?.slice(0,6));
