// Evidence screenshots on the new build (1600x900) with element rectangles. Nothing is sent; QA records removed / ticket closed at the end.
await page.setViewportSize({ width: 1600, height: 900 });
const out = {};
const rect = async (sel, textRe) => page.evaluate(([sel, src]) => { const re = src ? new RegExp(src) : null; const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent !== null && (!re || re.test((e.textContent || '').trim()))); const e = els[0]; if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }, [sel, textRe || null]);
const waitList = async () => { for (let i = 0; i < 40 && !(await txt()).includes('Total Count'); i++) await sleep(1000); await sleep(1500); };
try {
  // A-B2 / A-B7: Add Task drawer, Status empty
  await go('/activities', 5000); await waitList();
  await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Task/ }).first().click(); await sleep(3500);
  out.addTask = { s: await shot('ev-A-B2-addtask'), status: await rect('[role=dialog] *', '^Status\\s*Select$'), subject: await rect('[role=dialog] input[placeholder="Type or pick a subject"]'), dlg: await rect('[role=dialog]') };
  await page.keyboard.press('Escape'); await sleep(800);
  // A-B2: Open view without the no-status task
  const t1 = (await mk('tasks', { subject: 'QA ACT EV no status', due_date: iso(-D1) }, 'ev')).id;
  const t2 = (await mk('tasks', { subject: 'QA ACT EV not started', status: 'Not Started', due_date: iso(-D1) }, 'ev')).id;
  for (const [v, n] of [['Open', 'open'], ['All Tasks', 'all']]) {
    await go('/modules/' + M.tasks, 5000); await waitList();
    await page.locator('main button').filter({ hasText: /\(\d+\)/ }).first().click(); await sleep(1200);
    if (v !== 'All Tasks') { await page.getByText('All views', { exact: false }).last().click(); await sleep(1200); }
    await page.getByText(v, { exact: true }).last().click(); await sleep(4000);
    await page.getByRole('button', { name: 'Search in this view' }).click().catch(() => {}); await sleep(400);
    await page.locator('main input[type=search], main input[placeholder*="Search" i]').first().fill('QA ACT EV'); await sleep(3500);
    out['view_' + n] = { s: await shot('ev-A-B2-view-' + n), head: await rect('main button', '\\(\\d+\\)'), rows: ((await txt()).match(/QA ACT EV [a-z ]+/g) || []) };
  }
  // A-B3: task detail priority + call detail status/direction
  await patch('tasks', t2, { priority: 'highest' });
  await go(`/modules/${M.tasks}/records/${t2}`, 9000);
  out.taskDetail = { s: await shot('ev-A-B3-task'), priority: await rect('[data-testid="desk-activity-priority"]'), status: await rect('button', '^Status') };
  const c = (await mk('calls', { subject: 'QA ACT EV call', call_start_time: iso(H1), call_status: 'scheduled', call_type: 'outbound', priority: 'high' }, 'ev')).id;
  await go(`/modules/${M.calls}/records/${c}`, 9000);
  out.callDetail = { s: await shot('ev-A-B3-call'), callStatus: await rect('*', '^Call Status\\s*scheduled'), direction: await rect('*', '^Direction\\s*outbound$') };
  // A-B7: accessible names in the drawer
  await go('/activities', 5000); await waitList();
  await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Task/ }).first().click(); await sleep(3500);
  out.a11y = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] input, [role=dialog] button, [role=dialog] textarea')].filter(e => e.offsetParent !== null).map(e => { const id = e.id; const lab = id ? document.querySelector('label[for="' + id + '"]') : null; const name = e.getAttribute('aria-label') || (lab && lab.textContent.trim()) || (e.tagName === 'BUTTON' ? e.textContent.trim() : '') || ''; return e.tagName.toLowerCase() + (e.type ? '[' + e.type + ']' : '') + ' name="' + name.slice(0, 30) + '" placeholder="' + (e.getAttribute('placeholder') || '') + '"'; }));
  await page.keyboard.press('Escape'); await sleep(500);
  for (const [k, id] of [['tasks', t1], ['tasks', t2], ['calls', c]]) await api('DELETE', `/modules/${M[k]}/records/${id}`);
} catch (e) { out.err = String(e.message).slice(0, 300); await shot('ev2-error'); }
return JSON.stringify(out);
