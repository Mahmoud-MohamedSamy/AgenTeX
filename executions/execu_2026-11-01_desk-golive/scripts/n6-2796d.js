const o = {};
await page.mouse.click(1185, 585); await sleep(4000);
const t = (await txt()).replace(/\s+/g, ' ');
o.layout = await page.evaluate(() => { const s = [...document.querySelectorAll('select, button, [role=combobox]')].find(e => e.getBoundingClientRect().y < 150 && e.getBoundingClientRect().x > 520 && e.getBoundingClientRect().x < 820); return s ? (s.tagName === 'SELECT' ? s.options[s.selectedIndex].text : s.innerText.trim()) : null; });
o.dept = t.match(/Department.{0,40}/)?.[0]; o.hasADM = /QA NDC IATA Source|QA NDC ADM Number|QA NDC Airline Code/.test(t);
o.shot = await shot('rt/2796-create-acc2');
// open the layout picker to see the choices offered for this department
await page.mouse.click(675, 125); await sleep(1500);
o.opts = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim())).catch(() => []);
o.shot2 = await shot('rt/2796-layout-picker'); await page.keyboard.press('Escape');
return JSON.stringify(o);
