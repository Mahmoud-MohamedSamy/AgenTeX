const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b';
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(6000);
await shot('c02-layouts-table');
const rows = await page.$$eval('main tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ') + ' || btns:' + [...t.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.innerText).join(',')));
return { rows };
