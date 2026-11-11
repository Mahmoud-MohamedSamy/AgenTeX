const resps=[]; page.on('response',async r=>{const u=r.url(); if(/layouts|\/fields/.test(u) && r.request().method()!=='GET') resps.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'')+' '+(await r.text().catch(()=>'')).slice(0,160));});
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/1b55c25d-eb27-4046-afd1-b292398b435b', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Phone 2/.test(await text())) break; }
const canvas = page.locator('main');
// 1) rename the Phone 2 label
const lab = canvas.getByText('Phone 2', {exact:true}).first(); await lab.dblclick().catch(()=>lab.click()); await sleep(1000);
let inp = page.locator('input:focus'); log('focused input', await inp.count());
if (await inp.count()) { await inp.fill('QA RT15 Phone 2'); await page.keyboard.press('Enter'); await sleep(1000); }
await shot('2815-label-renamed.png');
await page.getByRole('button', {name:'Save', exact:true}).first().click(); await sleep(6000);
log('toasts1', await page.$$eval('[data-sonner-toast]', ts => ts.map(t=>t.innerText.trim())));
await shot('2815-label-saved.png');
// 2) remove the field from the layout
const lab2 = canvas.getByText(/^(QA RT15 Phone 2|Phone 2)$/).first(); await lab2.hover(); await sleep(800);
const box = lab2.locator('xpath=ancestor::*[.//button][1]'); log('btns', await box.locator('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label')||b.innerText.trim())));
const rm = box.getByRole('button', {name:/Remove from Layout/i}); if (await rm.count()) { await rm.first().click(); } else { await box.getByRole('button', {name:/Field options/i}).first().click(); await sleep(800); await page.getByText(/Remove from Layout/i).first().click(); }
await sleep(1500); const cf = page.getByRole('button', {name:/^(Remove|Confirm|Yes)/}).last(); if (await cf.count()) { await cf.click(); await sleep(1000); }
await shot('2815-removed.png');
await page.getByRole('button', {name:'Save', exact:true}).first().click(); await sleep(6000);
log('toasts2', await page.$$eval('[data-sonner-toast]', ts => ts.map(t=>t.innerText.trim())));
await shot('2815-removed-saved.png');
log('resps', resps);
