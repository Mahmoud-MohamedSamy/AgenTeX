const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
await page.goto(H + `/modules/${M}/records/new?layout=${L}`, { waitUntil: 'domcontentloaded' }); await sleep(6000);
await shot('rec-new-form');
const res = {};
res.labels = await page.$$eval('label', ls => ls.map(l => l.innerText.trim()).filter(Boolean)).catch(() => []);
const field = lbl => page.locator(`xpath=//*[normalize-space(text())='${lbl}']/ancestor::*[.//input or .//select or .//button[@role='combobox']][1]`).first();
await field('Name').locator('input').first().fill('QA R2W5 UI rec');
// pick list parent
const pick = field('QA Pick');
res.pickCtrl = await pick.evaluate(e => e.outerHTML.slice(0, 300));
return res;
