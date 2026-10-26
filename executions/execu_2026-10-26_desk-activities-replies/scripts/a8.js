// View pickers per kind page + sidebar entries + custom view create entry
const out = {};
await go('/activities', 6000); for (let i = 0; i < 40 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
out.sidebar = await page.$$eval('nav a, aside a', as => as.map(a => (a.textContent || '').trim() + ' ' + a.getAttribute('href')).filter(x => /activit|task|call|event/i.test(x)));
for (const k of ['Tasks', 'Calls', 'Events']) {
  await page.locator('aside a, nav a').filter({ hasText: new RegExp('^\\s*' + k + '\\s*$') }).first().click(); await sleep(6000);
  out[k + 'Url'] = page.url();
  const head = page.locator('main button').filter({ hasText: /\(\d+\)/ }).first(); out[k + 'Head'] = await head.innerText().catch(() => 'none');
  await head.click().catch(() => {}); await sleep(1800);
  out[k + 'Views'] = (await page.$$eval('[role=menu] *, [role=listbox] *, [role=dialog] *', ms => [...new Set(ms.filter(m => m.offsetParent !== null && m.children.length === 0).map(m => (m.textContent || '').trim()).filter(Boolean))])).slice(0, 60);
  await shot('ACT-B3-' + k.toLowerCase() + '-views'); await page.keyboard.press('Escape'); await sleep(500);
}
await page.locator('aside a, nav a').filter({ hasText: /^\s*All Activities\s*$/ }).first().click(); await sleep(5000);
await page.locator('main button').filter({ hasText: /\(\d+\)/ }).first().click(); await sleep(1800);
out.allViews = (await page.$$eval('[role=menu] *, [role=listbox] *, [role=dialog] *', ms => [...new Set(ms.filter(m => m.offsetParent !== null && m.children.length === 0).map(m => (m.textContent || '').trim()).filter(Boolean))])).slice(0, 60);
await shot('ACT-B3-all-views');
return JSON.stringify(out);
