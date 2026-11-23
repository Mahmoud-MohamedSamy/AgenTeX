await page.goto(H+'/settings/security/audit-log',{waitUntil:'domcontentloaded'});
for(let i=0;i<40;i++){await sleep(3000);const t=await page.locator('body').innerText().catch(()=>'');if(/IP /.test(t))break;}
await sleep(3000);const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');
await shot('3067-auditlog.png');return {ips:(t.match(/IP [^ ]+/g)||[]).slice(0,30).map(s=>s.replace(/\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b/g,'$1.x.x')),internal:/172\.19|::ffff/.test(t),head:t.slice(0,300)};
