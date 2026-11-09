// NDC-2656: the owner's own "Assign profile" control — disabled? which options? (read-only; nothing is clicked or assigned)
const ME = 'anyware-staging-owner@anyware.software';
await page.goto(H + '/settings/general/users', { waitUntil: 'domcontentloaded', timeout: 150000 });
await page.waitForSelector('input[placeholder^="Search by email"]', { timeout: 120000 }); await sleep(2000);
await page.fill('input[placeholder^="Search by email"]', ME); await sleep(4000);
await page.locator('tr', { hasText: ME }).first().click(); await page.waitForSelector('text=ASSIGN PROFILE', { timeout: 60000 }); await sleep(2000);
const info = await page.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.innerText?.trim().toUpperCase() === 'ASSIGN PROFILE'); let c = h; for (let i = 0; i < 5 && c && !c.querySelector('select'); i++) c = c.parentElement;
  const s = c?.querySelector('select'); const b = [...(c?.querySelectorAll('button') || [])].find(x => /Assign/.test(x.innerText));
  return { selectDisabled: s?.disabled, options: s ? [...s.options].map(o => o.textContent.trim()) : null, assignDisabled: b?.disabled, note: c?.innerText?.split('\n').slice(-2).join(' ') }; });
await page.getByRole('heading', { name: 'Assign profile' }).scrollIntoViewIfNeeded(); await shot('2656-4-assign-profile.png');
return info;
