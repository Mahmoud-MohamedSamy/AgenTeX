await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Escalate Ticket/i.test(await text())) break; }
await page.getByText('Escalate Ticket', {exact:true}).first().click(); await sleep(3000);
await page.getByRole('button', { name: 'Field update', exact: true }).first().click(); await sleep(2000);
await shot('2729-4-desk-fu-added.png');
const info = await page.evaluate(() => { const out=[]; document.querySelectorAll('select').forEach(s=>{ const r=s.getBoundingClientRect(); if(r.height>0) out.push({y:Math.round(r.y), x:Math.round(r.x), sel:s.options[s.selectedIndex]&&s.options[s.selectedIndex].text, n:s.options.length, opts:[...s.options].map(o=>o.text).slice(0,25)}); }); return out; });
return {info, side:(await text()).slice(-2500)};
