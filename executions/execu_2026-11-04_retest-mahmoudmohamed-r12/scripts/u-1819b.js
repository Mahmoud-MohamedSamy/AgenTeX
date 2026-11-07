const st = {};
const open = async (q) => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(3000);
  if (q) { await page.getByRole('button', { name: q }).first().click(); await sleep(8000); } };
const panel = async (tag) => { await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(3000); await shot(`1819-b-${tag}-filter.png`);
  const t = await text(); const i = t.search(/Filter (Tasks|Leads|Calls|\w+) by/); st[tag] = t.slice(i, i + 1500).replace(/\n+/g, ' | ');
  st[tag + '_heads'] = await page.locator('h2,h3,h4,[role=heading],summary,button[aria-expanded]').evaluateAll(a => a.map(x => x.innerText.trim()).filter(x => x && x.length < 60)); };
await open(); await panel('tasks');
await open('My Leads, 51 records'); await panel('leads');
return st;
