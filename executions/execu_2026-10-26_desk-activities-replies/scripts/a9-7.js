// Views via the "ALL VIEWS" submenu: list them, then check which seeded QA tasks each standard view shows
const waitList = async () => { for (let i = 0; i < 40 && !(await txt()).includes('Total Count'); i++) await sleep(1000); await sleep(1500); };
const leaf = async () => [...new Set((await page.$$eval('[role=menu] *, [role=listbox] *, [role=dialog] *', ms => ms.filter(m => m.offsetParent !== null && m.children.length === 0).map(m => (m.textContent || '').trim()).filter(Boolean))))];
const openAll = async () => { await page.locator('main button').filter({ hasText: /\(\d+\)/ }).first().click(); await sleep(1500); await page.getByText('All views', { exact: false }).last().click(); await sleep(1500); };
const out = {};
await go('/modules/' + M.tasks, 6000); await waitList();
await openAll(); out.taskViews = await leaf(); await shot('ACT-B3-task-allviews');
await page.keyboard.press('Escape'); await sleep(400);
const seeds = ['QA ACT B ov', 'QA ACT B done', 'QA ACT B can', 'QA ACT B tod', 'QA ACT B tom', 'QA ACT B d5', 'QA ACT B d10', 'QA ACT B nostatus'];
const ONLY = (globalThis.__only || null); const names0 = out.taskViews.filter(v => !/^\d+$/.test(v) && !/Search views|Starred|All views|Add Custom View/i.test(v));
const names = names0.slice(Number('7'), Number('11')); out.all = names0; const res = {};
for (const v of names) {
  try {
    await go('/modules/' + M.tasks, 5000); await waitList(); await openAll();
    await page.getByText(v, { exact: true }).last().click(); await sleep(4500);
    await page.getByRole('button', { name: 'Search in this view' }).click().catch(() => {}); await sleep(500);
    await page.locator('main input[type=search], main input[placeholder*="Search" i]').first().fill('QA ACT B '); await sleep(3500);
    const t = await txt(); res[v] = seeds.filter(s => t.includes(s)).map(s => s.replace('QA ACT B ', '')).join(',') || '(none)';
  } catch (e) { res[v] = 'ERR ' + String(e.message).slice(0, 60); }
}
out.membership = res;
return JSON.stringify(out);
