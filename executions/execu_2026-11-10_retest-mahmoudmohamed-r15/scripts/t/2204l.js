await page.goto(H + '/settings/users-control/agents', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); const t = await text(); if (/Active Agents\s*1\d/.test(t)) break; }
await page.getByText('Rows per page').locator('xpath=following::*[self::button or self::select][1]').click().catch(()=>{}); await sleep(800);
await page.getByRole('option', {name:'50'}).click().catch(()=>{}); await sleep(3000);
const rows = await page.$$eval('tbody tr', trs => trs.map(t=>[...t.querySelectorAll('td')].map(td=>td.innerText.replace(/\s+/g,' ').trim())));
log(rows.map(r=>[String(r[0]||'').replace(/\S+@\S+/g,'').trim(), r[2], r[4]].join(' | ')));
await shot('2204-agents-list.png');
