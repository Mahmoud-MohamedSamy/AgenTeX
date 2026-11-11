await page.goto(H + '/settings/users-control/agents', { waitUntil: 'domcontentloaded' }); for (let i=0;i<20;i++){ await sleep(2000); if (/Mahmoud Mohamed|Test SL-51/.test(await text())) break; }
log(page.url());
const s = page.getByPlaceholder(/Search/i).last(); if (await s.count()) { await s.fill('Mahmoud Mohamed'); await sleep(3000); }
const rows = await page.$$eval('tr', trs => trs.map(t=>t.innerText.replace(/\s+/g,' ')).filter(x=>/Mahmoud Mohamed/.test(x))); log(rows);
await shot('2204-agents.png');
const hdr = await page.$$eval('th', ths => ths.map(t=>t.innerText.trim())); log(hdr);
