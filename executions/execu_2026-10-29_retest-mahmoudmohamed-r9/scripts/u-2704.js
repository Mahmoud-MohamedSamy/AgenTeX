// NDC-2704: Home — column headers of the "My Tasks" and "My Meetings Today" cards (field names, not raw keys like due_date / related_to / from_time).
await page.goto(H + '/', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=/My Tasks/i', { timeout: 120000 }); await sleep(6000);
await shot('2704-home.png');
const cards = await page.evaluate(() => ['My Tasks', 'My Meetings Today'].map(n => { const h = [...document.querySelectorAll('h1,h2,h3,h4,span,div')].find(e => e.children.length === 0 && e.innerText?.trim() === n);
  let c = h; for (let i = 0; i < 6 && c && !c.querySelector('th, [role=columnheader]'); i++) c = c.parentElement;
  const heads = c ? [...c.querySelectorAll('th, [role=columnheader]')].map(x => x.innerText.trim()).filter(Boolean) : [];
  return { card: n, found: !!h, headers: heads, raw: heads.filter(x => /^[a-z]+(_[a-z]+)+$/.test(x) || /^[a-z_]+$/.test(x)), empty: c && !heads.length ? c.innerText.replace(/\s+/g, ' ').slice(0, 120) : null }; }));
return cards;
