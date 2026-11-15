await page.goto(H + '/settings/automation/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/Escalate Ticket/i.test(await text())) break; }
await page.getByText('Escalate Ticket', {exact:true}).first().click(); await sleep(3000);
await page.getByRole('button', { name: 'Create task', exact: true }).first().click(); await sleep(2000);
const sels = await page.evaluate(() => [...document.querySelectorAll('select')].filter(s=>s.getBoundingClientRect().x>1150).map(s=>{ const lab=(s.closest('div').parentElement.querySelector('label')||{}).innerText||''; return {lab:lab.split('\n')[0], sel:s.options[s.selectedIndex]&&s.options[s.selectedIndex].text, opts:[...s.options].map(o=>o.text).join(',')}; }));
await page.getByText('ASSIGN TO').last().scrollIntoViewIfNeeded(); await sleep(500); await shot('2729-6-desk-ct-assign.png');
await page.getByText('Status',{exact:true}).last().scrollIntoViewIfNeeded(); await sleep(500); await shot('2729-8-desk-ct-status.png');
await page.getByText('A specific agent or team').last().click(); await sleep(1200); await page.getByText('ASSIGN TO').last().scrollIntoViewIfNeeded(); await sleep(400); await shot('2729-9-desk-ct-specific.png');
const tx=await text(); const k=tx.lastIndexOf('ASSIGN TO');
return {sels, specific: tx.slice(k,k+400), deptBoxes: /Department\*?\n/.test(tx.slice(k)), teamBox: /\nTeam\n/.test(tx.slice(k))};
