// ACT batch 7: views list, view membership, ticket ACTIVITY tab, no-status task, delete, bulk update, export
const TK = 'fa2de237-92ec-4944-8b5a-a05e1e1343e8';
const waitList = async () => { for (let i = 0; i < 40 && !(await txt()).includes('Total Count'); i++) await sleep(1000); await sleep(1500); };
const search = async q => { await page.getByRole('button', { name: 'Search in this view' }).click().catch(() => {}); await sleep(500); const sb = page.locator('main input[type=search], main input[placeholder*="Search" i]').first(); await sb.fill(q); await sleep(3500); return await txt(); };
const openView = async name => { await page.getByRole('button', { name: /^All Activities|Activities \(|^My |^Open|^Overdue|^Today|^Tomorrow|^Next 7|^Completed|^Canceled|^Spam|^Missed|^Deferred|^Waiting/ }).first().click(); await sleep(1500); const it = page.getByRole('menuitem', { name: new RegExp('^' + name.replace(/[+]/g, '\\+')) }).or(page.getByRole('option', { name: new RegExp('^' + name.replace(/[+]/g, '\\+')) })); await it.first().click(); await sleep(4000); };
try {
  await go('/activities', 6000); await waitList();
  await page.getByRole('button', { name: /^All Activities/ }).first().click(); await sleep(2000);
  const views = await page.$$eval('[role=menuitem], [role=option], [role=menuitemradio]', ms => ms.filter(m => m.offsetParent !== null).map(m => (m.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean));
  rec('ACT-B3', 'INFO', views.length + ' views: ' + views.join(' | ')); await shot('ACT-B3-views'); await page.keyboard.press('Escape');
  // seed: due -1d open, completed past, today +2h, tomorrow, +5d, +10d, no status
  const seeds = { ov: { subject: 'QA ACT B ov', status: 'Not Started', due_date: iso(-D1) }, done: { subject: 'QA ACT B done', status: 'Completed', due_date: iso(-D1) }, can: { subject: 'QA ACT B can', status: 'Canceled', due_date: iso(-D1) }, tod: { subject: 'QA ACT B tod', status: 'Not Started', due_date: new Date(new Date().setHours(23, 0, 0, 0)).toISOString() }, tom: { subject: 'QA ACT B tom', status: 'Not Started', due_date: iso(D1 + 2 * H1) }, d5: { subject: 'QA ACT B d5', status: 'Not Started', due_date: iso(5 * D1) }, d10: { subject: 'QA ACT B d10', status: 'Not Started', due_date: iso(10 * D1) }, nost: { subject: 'QA ACT B nostatus', due_date: iso(-D1) } };
  for (const [k, v] of Object.entries(seeds)) await mk('tasks', v, 'B-' + k);
  const want = { 'Open': ['ov', 'tod', 'tom', 'd5', 'd10', 'nost?'], 'Completed': ['done'], 'Canceled': ['can'], 'Overdue': ['ov', 'nost?'], "Today's": ['tod'], "Tomorrow's": ['tom'], 'Next 7 Days + Overdue': ['ov', 'tod', 'tom', 'd5'], 'Today + Overdue': ['ov', 'tod'] };
  const vres = {};
  for (const [v, exp] of Object.entries(want)) {
    try { await go('/activities', 5000); await waitList(); await openView(v); const t = await search('QA ACT B '); const seen = Object.keys(seeds).filter(k => t.includes(seeds[k].subject)); const expK = exp.map(x => x.replace('?', '')); const must = exp.filter(x => !x.endsWith('?')); const extra = seen.filter(k => !expK.includes(k)); const miss = must.filter(k => !seen.includes(k)); vres[v] = (miss.length || extra.length ? 'FAIL' : 'PASS') + ' seen=' + seen.join(',') + (miss.length ? ' missing=' + miss : '') + (extra.length ? ' extra=' + extra : ''); }
    catch (e) { vres[v] = 'ERR ' + String(e.message).slice(0, 80); }
  }
  rec('ACT-B4/B5/B6', Object.values(vres).some(x => /FAIL|ERR/.test(x)) ? 'FAIL' : 'PASS', JSON.stringify(vres));
  // H: ticket ACTIVITY tab
  const h = (await mk('tasks', { subject: 'QA ACT H task', status: 'Not Started', due_date: iso(D1), ticket_id: TK }, 'H')).id;
  await go(`/modules/${M.tickets}/records/${TK}`, 10000);
  await page.locator('main [role=tab], main button').filter({ hasText: /^\s*ACTIVITY\s*$/i }).first().click(); await sleep(7000);
  const ht = await txt(); rec('ACT-H2', /QA ACT H task/.test(ht) ? 'PASS' : 'FAIL', 'ticket tab shows the task: ' + /QA ACT H task/.test(ht) + '; tab text: ' + ((ht.match(/(Upcoming|All) Activities[\s\S]{0,300}/) || ['?'])[0]).replace(/\n/g, ' / '), { shot: await shot('ACT-H2-tab') });
  // H7 count
  const td = await api('GET', `/desk/tickets/${TK}`); rec('ACT-H7', 'GAP', 'ticket counts=' + JSON.stringify(td.j && td.j.data && td.j.data.counts) + ' (no activity / task count; Zoho taskCount)');
  // L1 delete via API + recycle bin
  const del = (await mk('tasks', { subject: 'QA ACT L1 task', status: 'Not Started' }, 'L1')).id; const dr = await api('DELETE', `/modules/${M.tasks}/records/${del}`); const g = await api('GET', `/modules/${M.tasks}/records/${del}`);
  rec('ACT-L1', dr.s < 300 && g.s === 404 ? 'PASS' : 'INFO', `DELETE ${dr.s}; GET after ${g.s}`);
  // I9 / J6 delete in UI
  await go(`/modules/${M.tasks}/records/${h}`, 8000); const hb = await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText).trim()));
  rec('ACT-I9', hb.some(x => /Delete/i.test(x)) ? 'PASS' : 'GAP', 'detail buttons: ' + hb.filter(Boolean).join(', ').slice(0, 300));
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('a7-error'); }
return fin();
