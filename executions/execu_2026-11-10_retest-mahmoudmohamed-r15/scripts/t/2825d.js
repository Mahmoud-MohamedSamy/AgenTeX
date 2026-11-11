await page.goto(H + '/views/all/tickets/e6603b06-c2b6-43d3-9446-c322e9e822c0', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2825/.test(await text())) break; } await sleep(3000);
await shot('2825-ticket.png');
const a = page.getByRole('tab', {name:/^Activity$/i}).or(page.getByText(/^Activity$/i)).first(); if (await a.count()) { await a.click(); await sleep(4000); }
const t = await text(); log(t.split('\n').filter(l=>/SLA|applied|due/i.test(l)).slice(0,20));
await shot('2825-activity.png');
const h = page.getByRole('tab', {name:/^History$/i}).or(page.getByText(/^History$/i)).first(); if (await h.count()) { await h.click(); await sleep(4000); await shot('2825-history.png'); log((await text()).split('\n').filter(l=>/SLA|Due|Priority/i.test(l)).slice(0,20)); }
