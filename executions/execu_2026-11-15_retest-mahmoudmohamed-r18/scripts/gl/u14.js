const reqs=[]; page.on('response',async r=>{ if(r.url().includes('/api/v1/audit') && r.request().method()==='GET'){ reqs.push(r.url().split('/api/v1')[1].slice(0,160)+' '+r.status()); }});
await page.goto(H+'/settings/security/audit-log',{waitUntil:'domcontentloaded'}); await sleep(15000);
const t=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
await shot('3027-1-audit-log.png');
const i=t.indexOf('4064'); 
return {reqs:reqs.slice(0,6), around:t.slice(Math.max(0,i-900),i+600), hasEngine:/EngineDeletedAt/i.test(t), hasEmail:/@example\.com/.test(t)};
