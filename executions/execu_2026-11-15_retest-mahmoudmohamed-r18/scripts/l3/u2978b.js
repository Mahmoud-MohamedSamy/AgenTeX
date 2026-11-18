const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'domcontentloaded'}); await page.waitForSelector('[data-rule-field]',{timeout:40000}).catch(()=>{}); await sleep(3000);
const fl=await page.locator('[data-rule-field]').evaluateAll(es=>es.map(e=>e.getAttribute('data-rule-field')+' :: '+e.innerText.replace(/\s+/g,' ').slice(0,60)+' :: '+(e.querySelector('input,select,button,textarea')||{}).tagName));
log('fields', fl);
const dep=page.locator('[data-rule-field="department"]'); log('dep html', (await dep.innerHTML()).slice(0,600));
await shot('2978-1-form.png');
