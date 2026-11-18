const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+C.ids.c1id,{waitUntil:'domcontentloaded'});
await page.getByText('Support Plan Info').first().waitFor({timeout:120000});
for(let i=0;i<30;i++){const t=await page.locator('#main-content').innerText();if(!/Loading the support plan/.test(t))break;await sleep(2000);}
await page.locator('button[aria-label="Support plan Info"]').first().evaluate(e=>e.click());await sleep(4000);
const sel=page.locator('select').first();log('selects',await page.locator('select').count());
const o=await sel.evaluate(s=>[...s.options].map(x=>x.text));log('options',JSON.stringify(o));
// other-dept plans visible?
log('hasDeptB',o.some(x=>/2841 B/.test(x)));
// expand native select visually not possible headless; take screenshot of panel
await shot('2841-2-change-plan.png');
