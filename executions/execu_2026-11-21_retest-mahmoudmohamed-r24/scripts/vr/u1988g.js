const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(require('fs').readFileSync('vr/ids.json','utf8'));
await page.goto(H+'/modules/'+T+'/records/new?layout='+I.layout,{waitUntil:'domcontentloaded'}); await page.waitForSelector('[data-rule-field]',{timeout:90000}).catch(()=>{}); await sleep(4000);
await page.locator('[data-rule-field="department"] button').first().click(); await sleep(1200); const s=page.locator('[role=listbox] input, [cmdk-input], input[placeholder*="Search" i]').last(); if(await s.count() && await s.isVisible().catch(()=>false)) { await s.fill('QA AO Dept A'); await sleep(1200);} 
const o=page.getByRole('option',{name:'QA AO Dept A',exact:true}).first(); if(await o.count()) await o.click(); else await page.getByText('QA AO Dept A',{exact:true}).last().click(); await sleep(4000);
log('top',(await text()).replace(/\s+/g,' ').slice(300,700)); log('fields', await page.locator('[data-rule-field]').evaluateAll(es=>es.map(e=>e.getAttribute('data-rule-field')+(e.hidden?'(h)':'')).filter(x=>/rt20|department/.test(x))));
log('combos', await page.locator('button[role=combobox], select').evaluateAll(es=>es.slice(0,5).map(e=>e.tagName+':'+e.innerText.slice(0,40))));
await shot('1988-dbg2.png');
