const bb = async (loc) => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
const o = {};
await page.goto(H + '/views/all/tickets/bf40208e-12e3-4e4c-93d6-2576d33efd6a', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2275 SEQ ui 1/.test(await text())) break; } await sleep(4000);
await page.getByRole('tab', { name: /History/i }).first().click(); await sleep(8000);
await shot('2275-e1-ui1-history.png');
o.created = await bb(page.getByText(/Ticket was created by/)); o.ownerUpd = await bb(page.getByText('Ticket Owner was updated'));
o.auto = await bb(page.getByText('Assigned automatically'));
const t = await text(); const i = t.lastIndexOf('History'); o.hist = t.slice(i, i + 900);
// form screenshot boxes: re-open create form to locate owner field
await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Round Robin Rules/.test(await text())) break; } await sleep(2000);
const dsel = page.getByRole('combobox').filter({ hasText: 'Customer Support' }).first(); await dsel.click().catch(() => {}); await sleep(1000); await page.keyboard.type('QA RT11 Dept A'); await sleep(1500); await page.getByRole('option', { name: 'QA RT11 Dept A' }).first().click().catch(() => {}); await sleep(5000);
await shot('2275-e2-rr-list.png'); o.rr1 = await bb(page.getByText('QA RT12 2275 RR1')); o.rrText = (await text()).match(/Round Robin Rules[\s\S]{0,600}/)?.[0];
return o;
