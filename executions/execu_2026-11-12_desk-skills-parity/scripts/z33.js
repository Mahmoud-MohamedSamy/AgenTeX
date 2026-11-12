async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/zoho/';
 await page.mouse.click(430, 834); await page.waitForTimeout(6000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 const titles = await f.$$eval('[title], [data-title], [aria-label]', es => es.filter(e=>e.offsetParent).map(e => [e.getAttribute('title')||e.getAttribute('data-title')||e.getAttribute('aria-label'), Math.round(e.getBoundingClientRect().x), Math.round(e.getBoundingClientRect().y)]).filter(x=>/pref|skill|config|setting/i.test(x[0])));
 return titles.slice(0,15); }
