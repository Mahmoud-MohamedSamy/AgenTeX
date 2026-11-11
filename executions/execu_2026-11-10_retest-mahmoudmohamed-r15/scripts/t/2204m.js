await page.goto(H + '/settings/users-control/agents', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); const t = await text(); if (/Active Agents\s*1\d/.test(t)) break; }
await page.getByText('All Agents', {exact:false}).first().click().catch(()=>{}); await sleep(4000);
const out=[];
for (let p=0;p<4;p++){
  const rows = await page.$$eval('tbody tr', trs => trs.map(t=>[...t.querySelectorAll('td')].map(td=>td.innerText.replace(/\s+/g,' ').trim())));
  rows.forEach(r=>out.push([String(r[0]||'').replace(/\S+@\S+/g,'').trim(), r[1], r[2], r[4], r[5]].join(' | ')));
  const btns = page.locator('button:right-of(:text("Page"))'); const nx = btns.last();
  if (await nx.isEnabled().catch(()=>false)) { await nx.click(); await sleep(3000); } else break;
}
log([...new Set(out)]);
await shot('2204-agents-p2.png');
