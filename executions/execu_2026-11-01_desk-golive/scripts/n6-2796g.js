const o = {};
await page.mouse.click(1569, 103); await sleep(1500);
o.menu = (await page.$$eval('[role=menuitem], [role=menu] button, [role=menu] a', es => es.map(e => e.innerText.trim()).filter(Boolean)));
o.shot = await shot('rt/2796-ticket-kebab');
const ch = page.getByText(/Change layout|Switch layout|Layout/, { exact: false }).filter({ visible: true }).first(); o.ch = await ch.count();
return JSON.stringify(o);
