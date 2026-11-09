const res = { runs: [] };
for (let i = 0; i < 3; i++) {
  await page.goto(H + '/home', { waitUntil: 'domcontentloaded' });
  const snaps = [];
  for (const s of [2, 5, 10]) { await sleep(s === 2 ? 2000 : (s === 5 ? 3000 : 5000)); const t = (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' '); snaps.push(s + 's: ' + (t.match(/My Tasks.{0,70}/) || [''])[0] + ' | ' + (t.match(/My Meetings Today.{0,50}/) || [''])[0]); }
  res.runs.push(snaps);
  if (i === 0) await shot('c17-home');
}
// home views / greeting (NDC-163), components (NDC-2027)
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
res.greeting = t.slice(0, 60);
await page.locator('main button', { hasText: /Classic View/ }).first().click().catch(() => {}); await sleep(1200);
res.views = await page.evaluate(() => [...document.querySelectorAll('[role=menu], [role=listbox]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || '));
await shot('c17-home-views'); await page.keyboard.press('Escape');
return res;
