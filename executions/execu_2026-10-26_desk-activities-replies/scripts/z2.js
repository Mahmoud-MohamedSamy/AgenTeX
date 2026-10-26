// Read-only: view picker; Add Task / Call / Event forms opened then cancelled (never saved)
await go('/activities/list/all-activities', 10000);
const dd = page.getByText('All Activities', { exact: true }).first(); await dd.click().catch(() => {}); await sleep(2500);
out.views = (await txt()).split('All Activities').slice(1).join(' | ').slice(0, 1500); out.viewsShot = await shot('activities-views');
await page.keyboard.press('Escape'); await sleep(800);
for (const kind of ['Tasks', 'Calls', 'Events']) {
  await go('/' + kind.toLowerCase() + '/list', 9000);
  out[kind + 'Url'] = page.url();
  const add = page.locator('button, a, span').filter({ hasText: new RegExp('^\s*(Add|New) ?' + kind.slice(0, -1) + '\s*$|^\s*Add Activity\s*$', 'i') }).first();
  try { await add.click({ timeout: 8000 }); } catch (e) { out[kind + 'AddErr'] = String(e.message).slice(0, 100); }
  await sleep(5000);
  out[kind + 'Form'] = (await txt()).slice(0, 2500); out[kind + 'Shot'] = await shot('add-' + kind.toLowerCase());
  const c = page.locator('button, a').filter({ hasText: /^\s*Cancel\s*$/ }); if (await c.count()) { await c.last().click().catch(() => {}); await sleep(1500); const d = page.locator('button').filter({ hasText: /^\s*(Discard|Yes|Leave)\s*$/ }); if (await d.count()) await d.first().click().catch(() => {}); }
}
