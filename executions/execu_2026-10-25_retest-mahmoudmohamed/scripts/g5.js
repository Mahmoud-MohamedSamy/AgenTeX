await shot('2120-00-menu');
const items = await page.evaluate(() => [...document.querySelectorAll('[role=menuitem], [role=menu] *')].map(e => e.innerText?.trim()).filter(Boolean).slice(0, 15));
return done({ items, field: (await txt()).includes('QA RT Pick') });
