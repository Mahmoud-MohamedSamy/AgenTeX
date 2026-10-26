// ACT batch 3: call life cycle through the detail page (calls created by API, linked to the QA ticket)
const TK = 'fa2de237-92ec-4944-8b5a-a05e1e1343e8';
const pageText = async () => (await txt());
const btn = n => page.getByRole('button', { name: n, exact: true });
const dlgText = async () => (await page.$$eval('[role=dialog], [role=alertdialog]', ds => ds.map(d => d.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => ''));
const mkCall = async (tag, extra) => { const r = await mk('calls', { subject: 'QA ACT ' + tag, call_start_time: iso(H1), call_status: 'scheduled', call_type: 'outbound', ticket_id: TK, ...(extra || {}) }, tag); return r.id; };
const st = async id => (await recOf('calls', id)).o;
try {
  // E1 + E2 + E3 start / end answered with notes
  const c1 = await mkCall('E1 call');
  await go(`/modules/${M.calls}/records/${c1}`, 9000);
  const b0 = await page.$$eval('main button', bs => [...new Set(bs.map(b => (b.getAttribute('aria-label') || b.innerText).trim()).filter(Boolean))]);
  rec('ACT-E-buttons', 'INFO', 'scheduled call buttons: ' + b0.filter(x => /Call|missed|Reschedule|Cancel|Reopen|Complete/i.test(x)).join(', '));
  await btn('Start Call').click(); await sleep(3000);
  let o = await st(c1); rec('ACT-E1', o.call_status === 'in_progress' ? 'PASS' : 'FAIL', `status=${o.call_status} start=${o.call_start_time}`);
  await btn('End Call').first().click(); await sleep(1500);
  const endDlg = await dlgText();
  await page.getByRole('radio', { name: 'Answered' }).check().catch(() => page.getByText('Answered', { exact: true }).click());
  await page.locator('[role=dialog] textarea').first().fill('QA ACT notes E3'); await sleep(300);
  await page.locator('[role=dialog] button').filter({ hasText: /^End Call$/ }).last().click(); await sleep(3500);
  o = await st(c1); rec('ACT-E2', o.call_status === 'completed' && o.call_outcome === 'answered' ? 'PASS' : 'FAIL', `dialog="${endDlg.slice(0, 200)}" status=${o.call_status} outcome=${o.call_outcome} duration=${o.call_duration} end=${o.call_end_time}`);
  const cm = await api('GET', `/desk/tickets/${TK}/comments`); const cms = (cm.j && cm.j.data) || [];
  const note = cms.find(c => /QA ACT notes E3/.test(c.body_html || c.body || c.body_text || ''));
  rec('ACT-E3', note && note.is_public === false ? 'PASS' : 'FAIL', note ? 'ticket comment is_public=' + note.is_public + ' text=' + JSON.stringify((note.body_text || note.body_html || '').slice(0, 80)) : 'no ticket comment with the notes; comments=' + cms.length);
  // E8 completed read-only (UI + API)
  await go(`/modules/${M.calls}/records/${c1}`, 8000); const t8 = await pageText();
  const p8 = await patch('calls', c1, { subject: 'QA ACT E1 call edited' }); const o8 = await st(c1);
  rec('ACT-E8', /Completed calls cannot be edited/.test(t8) && o8.subject !== 'QA ACT E1 call edited' ? 'PASS' : 'FAIL', `UI message shown=${/Completed calls cannot be edited/.test(t8)}; API PATCH subject ${p8.s} -> subject now "${o8.subject}"`);
  // E10 reopen
  await btn('Reopen Call').click().catch(e => rec('ACT-E10', 'FAIL', 'no Reopen Call button')); await sleep(3000);
  o = await st(c1); rec('ACT-E10', o.call_status === 'scheduled' || o.call_status === 'in_progress' ? 'PASS' : 'FAIL', 'after reopen status=' + o.call_status);
  // E4 end unanswered
  const c4 = await mkCall('E4 call'); await go(`/modules/${M.calls}/records/${c4}`, 8000);
  await btn('Start Call').click(); await sleep(2500); await btn('End Call').first().click(); await sleep(1200);
  await page.getByRole('radio', { name: 'Unanswered' }).check().catch(() => page.getByText('Unanswered', { exact: true }).click());
  await page.locator('[role=dialog] button').filter({ hasText: /^End Call$/ }).last().click(); await sleep(3000);
  o = await st(c4); rec('ACT-E4', 'INFO', `unanswered end -> status=${o.call_status} outcome=${o.call_outcome} type=${o.call_type}`);
  // E5 mark as missed
  const c5 = await mkCall('E5 call'); await go(`/modules/${M.calls}/records/${c5}`, 8000);
  await btn('Mark as missed').click(); await sleep(1500); const d5 = await dlgText(); if (d5) { await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /missed|Confirm|Yes/i }).last().click().catch(() => {}); await sleep(2500); }
  o = await st(c5); rec('ACT-E5', o.call_status === 'missed' ? 'PASS' : 'FAIL', `dialog="${d5.slice(0, 120)}" status=${o.call_status}`);
  // E6 reschedule with missed log
  const c6 = await mkCall('E6 call'); await go(`/modules/${M.calls}/records/${c6}`, 8000);
  await btn('Reschedule').click(); await sleep(1500); const d6 = await dlgText();
  const dt = new Date(Date.now() + D1); const pad = n => String(n).padStart(2, '0'); const loc = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T10:00`;
  await page.locator('[role=dialog] input[type=datetime-local]').first().fill(loc);
  const cb = page.locator('[role=dialog] input[type=checkbox]'); if (await cb.count()) await cb.first().check();
  await page.locator('[role=dialog] button').filter({ hasText: /^Reschedule$/ }).last().click(); await sleep(3500);
  o = await st(c6);
  const L = await api('GET', `/modules/${M.calls}/records?page=1&per_page=30&sort_by=created_at&sort_dir=desc`); const recent = ((L.j.data.records || L.j.data.items || L.j.data) || []).map(fl);
  const missedLog = recent.filter(x => x.id !== c6 && /E6/.test(x.subject || '') ); for (const m of missedLog) CREATED.push({ k: 'calls', id: m.id, tag: 'E6-missed-log' });
  rec('ACT-E6', missedLog.length && o.call_status === 'scheduled' ? 'PASS' : 'FAIL', `dialog="${d6.slice(0, 160)}" call now status=${o.call_status} start=${o.call_start_time}; missed-log rows=${missedLog.map(m => m.call_status + '/' + m.call_type).join(',')}`);
  // E9 cancel
  const c9 = await mkCall('E9 call'); await go(`/modules/${M.calls}/records/${c9}`, 8000);
  await btn('Cancel Call').click(); await sleep(1500); const d9 = await dlgText(); if (d9) { await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /Cancel Call|Confirm|Yes/i }).last().click().catch(() => {}); await sleep(2500); }
  o = await st(c9); rec('ACT-E9', o.call_status === 'cancelled' ? 'PASS' : 'FAIL', `dialog="${d9.slice(0, 120)}" status=${o.call_status}`);
  await go(`/modules/${M.calls}/records/${c9}`, 7000); const b9 = await page.$$eval('main button', bs => bs.map(b => b.innerText.trim()));
  rec('ACT-E12', !b9.includes('Start Call') ? 'PASS' : 'FAIL', 'cancelled call buttons: ' + b9.filter(x => /Call|Reopen/.test(x)).join(', '));
  // E11 overdue scheduled call
  const c11 = await mkCall('E11 call', { call_start_time: iso(-H1) }); await go('/activities', 6000); for (let i = 0; i < 30 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
  await page.getByRole('searchbox').or(page.getByPlaceholder(/Search in this view/)).first().fill('QA ACT E11'); await sleep(3000);
  const t11 = await txt(); rec('ACT-E11', /QA ACT E11 call[\s\S]{0,60}Overdue/.test(t11) ? 'PASS' : 'FAIL', 'row: ' + ((t11.match(/QA ACT E11 call[\s\S]{0,60}/) || [''])[0]).replace(/\n/g, ' / '));
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('a3-error'); }
return fin();
