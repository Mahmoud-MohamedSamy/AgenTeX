// Read-only activities tour (agent): view dropdown, add menu + task/call/event forms (cancelled), detail page actions, table layout + bulk bar
const out = {};
const writes = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && r.method() !== 'GET' && !/heartbeat|presence|\/read$|summaries|resolved-batch|lookups|realtime|iam\/auth/.test(u)) writes.push(r.method() + ' ' + u.replace(API, '')); }; page.on('request', f);
const menu = async () => (await page.$$eval('[role=menuitem], [role=menuitemradio], [role=option], [role=menu] a, [role=menu] button, [role=listbox] *, [role=dialog] *', bs => [...new Set(bs.filter(b => b.offsetParent !== null && b.children.length < 3).map(b => b.innerText.trim().replace(/\s+/g, ' ')).filter(x => x && x.length < 60))])).slice(0, 80);
await go('/activities', 6000); for (let i = 0; i < 30 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
try { await page.getByRole('button', { name: /^All Activities/ }).first().click({ timeout: 8000 }); await sleep(2000); out.views = await menu(); out.viewsShot = await shot('tavi-activity-views'); } catch (e) { out.viewsErr = String(e.message).slice(0, 100); }
await page.keyboard.press('Escape'); await sleep(600);
try { await page.getByRole('button', { name: 'Add Activity' }).first().click({ timeout: 8000 }); await sleep(1500); out.addMenu = await menu(); } catch (e) { out.addErr = String(e.message).slice(0, 100); }
for (const k of ['Task', 'Call', 'Event']) {
  try { const it = page.getByRole('menuitem', { name: new RegExp(k) }).first(); if (!(await it.count())) { await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1200); } await page.getByRole('menuitem', { name: new RegExp(k) }).first().click({ timeout: 6000 }); await sleep(4000);
    out['form' + k] = (await page.$$eval('[role=dialog], aside', ds => ds.map(d => d.innerText.replace(/\s+/g, ' ')).join(' || '))).slice(0, 1800); out['form' + k + 'Shot'] = await shot('tavi-add-' + k.toLowerCase());
    const c = page.getByRole('button', { name: /^(Cancel|Close)$/ }); if (await c.count()) await c.first().click(); else await page.keyboard.press('Escape'); await sleep(1500);
  } catch (e) { out['form' + k + 'Err'] = String(e.message).slice(0, 100); await page.keyboard.press('Escape'); }
}
// open first task row detail
await page.getByRole('tab', { name: 'Tasks' }).click().catch(() => page.getByText('Tasks', { exact: true }).first().click()); await sleep(5000);
const link = page.locator('main a[href*="/activities/"], main a[href*="/records/"]').first();
out.firstLink = await link.getAttribute('href').catch(() => null);
if (out.firstLink) { await go(out.firstLink, 10000); out.detail = (await txt()).slice(0, 2500); out.detailShot = await shot('tavi-task-detail');
  try { await page.getByRole('button', { name: 'Activity actions' }).click({ timeout: 6000 }); await sleep(1200); out.detailActions = await menu(); await page.keyboard.press('Escape'); } catch (e) { out.detailActionsErr = String(e.message).slice(0, 80); }
  out.detailButtons = await page.$$eval('main button', bs => [...new Set(bs.map(b => (b.getAttribute('aria-label') || b.innerText).trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean))]); }
await go('/activities', 6000); for (let i = 0; i < 30 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
try { await page.getByRole('button', { name: 'Table' }).click(); await sleep(3000); await page.getByRole('checkbox').nth(1).check(); await sleep(1500); out.bulkBar = (await page.$$eval('main button', bs => [...new Set(bs.map(b => (b.getAttribute('aria-label') || b.innerText).trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean))])).slice(0, 40); out.tableShot = await shot('tavi-activities-table'); await page.getByRole('checkbox').nth(1).uncheck(); await page.getByRole('button', { name: 'Classic' }).click(); } catch (e) { out.bulkErr = String(e.message).slice(0, 100); }
page.off('request', f); out.writes = writes;
return done(out);
