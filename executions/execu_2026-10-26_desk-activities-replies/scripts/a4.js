// ACT batch 4: E6c reschedule without missed log, E11 overdue badge, events F1-F4, reminders G (UI first, capture shape, then API)
const TK = 'fa2de237-92ec-4944-8b5a-a05e1e1343e8';
const btn = n => page.getByRole('button', { name: n, exact: true });
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/') && !/heartbeat|presence|summaries|resolved|realtime|iam\//.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 400) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 250)); }; page.on('response', onR);
const loc = ms => { const d = new Date(Date.now() + ms); const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
try {
  // E6c
  const c = (await mk('calls', { subject: 'QA ACT E6c call', call_start_time: iso(H1), call_status: 'scheduled', call_type: 'outbound', ticket_id: TK }, 'E6c')).id;
  await go(`/modules/${M.calls}/records/${c}`, 8000); await btn('Reschedule').click(); await sleep(1200);
  const dlg = page.locator('[role=dialog]').last(); await dlg.locator('input[type=datetime-local]').fill(loc(D1)); await dlg.locator('input[type=checkbox]').uncheck({ force: true }).catch(() => {});
  net.length = 0; await dlg.locator('button').filter({ hasText: /^Reschedule$/ }).click(); await sleep(3500);
  const o = (await recOf('calls', c)).o; rec('ACT-E6c', Math.abs(new Date(o.call_start_time) - (Date.now() + D1)) < 3 * H1 ? 'PASS' : 'FAIL', 'without missed log: start now ' + o.call_start_time + ' net=' + net.join(' || ').slice(0, 400));
  // E11 overdue badge (search box by role textbox in the list header)
  await mk('calls', { subject: 'QA ACT E11 call', call_start_time: iso(-H1), call_status: 'scheduled', call_type: 'outbound' }, 'E11');
  await go('/activities', 6000); for (let i = 0; i < 30 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
  await page.getByRole('button', { name: 'Search in this view' }).click().catch(() => {}); await sleep(600);
  const sb = page.locator('main input[type=search], main input[placeholder*="Search" i]').first(); await sb.fill('QA ACT E11'); await sleep(3500);
  const t11 = await txt(); rec('ACT-E11', /QA ACT E11 call[\s\S]{0,80}Overdue/.test(t11) ? 'PASS' : 'FAIL', 'row: ' + ((t11.match(/QA ACT E11 call[\s\S]{0,80}/) || ['not found'])[0]).replace(/\n/g, ' / '));
  rec('ACT-B11', /QA ACT E11/.test(t11) && !/test call from workflow/.test(t11) ? 'PASS' : 'FAIL', 'search filters rows');
  // Events
  const ev = async (tag, from, to) => (await mk('events', { title: 'QA ACT ' + tag, from_time: iso(from), to_time: iso(to), status: 'scheduled', ticket_id: TK }, tag)).id;
  const e1 = await ev('F1 event', D1, D1 + H1); await go(`/modules/${M.events}/records/${e1}`, 8000);
  const eb = await page.$$eval('main button', bs => [...new Set(bs.map(b => (b.getAttribute('aria-label') || b.innerText).trim()).filter(Boolean))]);
  rec('ACT-F-buttons', 'INFO', eb.filter(x => /Complete|Cancel|Reopen|Invite|Status/i.test(x)).join(', '));
  await btn('Mark as Completed').click(); await sleep(3000); let eo = (await recOf('events', e1)).o; rec('ACT-F1', eo.status === 'completed' ? 'PASS' : 'FAIL', 'status=' + eo.status);
  await btn('Reopen Event').click().catch(() => {}); await sleep(3000); eo = (await recOf('events', e1)).o; rec('ACT-F3', eo.status === 'scheduled' ? 'PASS' : 'FAIL', 'after reopen status=' + eo.status);
  await btn('Cancel').last().click().catch(() => {}); await sleep(1200); const cd = await page.$$eval('[role=dialog], [role=alertdialog]', ds => ds.map(d => d.innerText.replace(/\s+/g, ' ')).join('|')); if (cd) { await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /Cancel event|Confirm|Yes/i }).last().click().catch(() => {}); await sleep(2500); }
  eo = (await recOf('events', e1)).o; rec('ACT-F2', eo.status === 'cancelled' ? 'PASS' : 'FAIL', 'dialog="' + cd.slice(0, 100) + '" status=' + eo.status);
  const e4 = await ev('F4 event past', -3 * H1, -2 * H1); const e4o = (await recOf('events', e4)).o; rec('ACT-F4', e4o.status === 'scheduled' ? 'PASS' : 'FAIL', 'ended event status=' + e4o.status + ' (stays open)');
  // Reminders: UI on a task due +20 min, "5 minutes before", pop-up
  const t = (await mk('tasks', { subject: 'QA ACT G task', status: 'Not Started', due_date: iso(20 * 60e3) }, 'G')).id;
  await go(`/modules/${M.tasks}/records/${t}`, 8000); net.length = 0;
  await btn('Set Reminder').click(); await sleep(1500);
  const rd = page.locator('[role=dialog]').last(); const rdt = (await rd.innerText()).replace(/\s+/g, ' ');
  const rds = await shot('ACT-G-dialog');
  rec('ACT-G-dialog', 'INFO', rdt.slice(0, 500) + ' ' + rds);
  // try: pick "Before", 5 minutes, pop-up
  const sel = rd.locator('select'); const ns = await sel.count(); const opts = []; for (let i = 0; i < ns; i++) opts.push(await sel.nth(i).evaluate(s => [...s.options].map(o => o.value + '=' + o.text).join(';')));
  rec('ACT-G-selects', 'INFO', opts.join(' || '));
  await rd.getByText('Before', { exact: true }).click().catch(() => {}); await sleep(400);
  const num = rd.locator('input[type=number]'); if (await num.count()) await num.first().fill('5');
  await rd.getByText('Pop-up', { exact: true }).click().catch(() => {});
  await rd.getByRole('button', { name: /^Save$/ }).click().catch(() => {}); await sleep(3000);
  const rl = await api('GET', `/desk/activities/${t}/reminders`); rec('ACT-G2/G3', rl.s === 200 && /reminders|items|data/.test(rl.t) ? 'INFO' : 'FAIL', 'reminders GET ' + rl.s + ' ' + rl.t.slice(0, 500) + ' | net=' + net.join(' || ').slice(0, 600));
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('a4-error'); }
page.off('response', onR);
return fin();
