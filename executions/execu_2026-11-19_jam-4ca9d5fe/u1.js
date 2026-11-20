await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit' });
await page.getByText(/Round Robin/i).first().waitFor({ timeout: 150000 }); await sleep(6000);
await shot('JAMR-1-rr-page.png');
const t = await text(); const i = t.search(/Round Robin/); log(t.slice(i, i + 900).replace(/\s+/g, ' '));
const combos = await page.$$eval('button,[role=combobox]', es => es.filter(e => e.offsetParent).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(x => x && x.length < 60)); log(combos.slice(0, 40));
