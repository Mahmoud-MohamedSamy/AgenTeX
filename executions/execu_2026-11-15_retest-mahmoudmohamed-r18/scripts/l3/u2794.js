const I=JSON.parse(require('fs').readFileSync('l3/ids.json','utf8'));
await page.goto(H+'/views/all/tickets/'+I.TK94,{waitUntil:'domcontentloaded'}); for(let i=0;i<20;i++){await sleep(2000); if(/QA RT18 2794 team\+agent ticket/.test(await text())) break;} await sleep(3000);
const t=await text(); const k=t.indexOf('Key Information'); log('key', t.slice(k,k+500).replace(/\n+/g,' | '));
log('team lines', t.split('\n').filter(l=>/QA RT18 2794 team|Team/.test(l)).slice(0,8));
await shot('2794-1-ticket.png');
