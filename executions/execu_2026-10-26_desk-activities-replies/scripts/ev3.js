// Retake A-B2 shots: Add Task drawer fully loaded; Open vs All Tasks views filtered to the two QA tasks
await page.setViewportSize({ width: 1600, height: 900 });
const out = {};
const rects = async (sel, src) => page.evaluate(([sel, src]) => { const re = new RegExp(src); return [...document.querySelectorAll(sel)].filter(e => e.offsetParent !== null && re.test((e.textContent || '').trim())).slice(0, 3).map(e => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }); }, [sel, src]);
const waitList = async () => { for (let i = 0; i < 40 && !(await txt()).includes('Total Count'); i++) await sleep(1000); await sleep(1500); };
try {
  await go('/activities', 5000); await waitList();
  await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Task/ }).first().click();
  await page.getByPlaceholder('Type or pick a subject').waitFor({ timeout: 30000 }); await sleep(1500);
  out.addTask = { s: await shot('ev-A-B2-addtask'), status: await rects('[role=dialog] div, [role=dialog] label', '^Status\\s*Select$'), subject: await rects('[role=dialog] div', '^Subject\\*?\\s*$') };
  await page.keyboard.press('Escape'); await sleep(800);
  const t1 = (await mk('tasks', { subject: 'QA ACT EV no status', due_date: iso(-D1) }, 'ev')).id;
  const t2 = (await mk('tasks', { subject: 'QA ACT EV not started', status: 'Not Started', due_date: iso(-D1) }, 'ev')).id;
  for (const [v, n] of [['Open', 'open'], ['All Tasks', 'all']]) {
    await go('/modules/' + M.tasks, 5000); await waitList();
    await page.locator('main button').filter({ hasText: /\(\d+\)/ }).first().click(); await sleep(1200);
    if (v !== 'All Tasks') { await page.getByText('All views', { exact: false }).last().click(); await sleep(1200); }
    await page.getByText(v, { exact: true }).last().click(); await sleep(4000);
    await page.getByRole('button', { name: 'Search in this view' }).click().catch(() => {}); await sleep(400);
    await page.locator('main input[type=search], main input[placeholder*="Search" i]').first().fill('QA ACT EV'); await page.keyboard.press('Enter');
    for (let i = 0; i < 30; i++) { await sleep(1000); const h = (await page.locator('main button').filter({ hasText: /\(\d+\)/ }).first().innerText().catch(() => '')); if (/\((1|2)\)/.test(h)) break; }
    await sleep(1500);
    out['view_' + n] = { s: await shot('ev-A-B2-view-' + n), head: await rects('main button', '\\(\\d+\\)'), rows: await rects('main a, main div', '^QA ACT EV (no status|not started)$') };
  }
  for (const id of [t1, t2]) await api('DELETE', `/modules/${M.tasks}/records/${id}`);
} catch (e) { out.err = String(e.message).slice(0, 300); await shot('ev3-error'); }
return JSON.stringify(out);
