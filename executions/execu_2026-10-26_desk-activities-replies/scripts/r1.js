// RPL batch 1: composer defaults on a fresh QA ticket, send options, send one reply (to mmohamed@anyware.software only), effects
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/desk/tickets') && !/viewers|read$|summaries/.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 700) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 400)); }; page.on('response', onR);
try {
  const tk = (await mk('tickets', { subject: 'QA RPL ticket 1', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }, 'rpl-ticket-1')).id;
  const t0 = await api('GET', `/desk/tickets/${tk}`); const num = t0.j.data.ticket_number || t0.j.data.display_number;
  await go(`/modules/${M.tickets}/records/${tk}`, 12000);
  const head = await page.$$eval('main button', bs => [...new Set(bs.map(b => (b.getAttribute('aria-label') || b.innerText).trim()).filter(Boolean))]);
  rec('RPL-A1', head.some(x => /^Reply/.test(x)) && head.some(x => /Comment/.test(x)) ? 'PASS' : 'FAIL', 'header: ' + head.filter(x => /Reply|Comment|Pick up|Forward/.test(x)).join(', '));
  await page.locator('main button').filter({ hasText: /^Reply All$|^Reply$/ }).first().click(); await sleep(5000);
  const comp = await txt(); const from = (comp.match(/From\n[^\n]*\n?([^\n]*)/) || [])[1];
  const recip = await page.$$eval('[aria-label^="Remove "]', bs => bs.map(b => b.getAttribute('aria-label').replace('Remove ', '')));
  const subj = await page.locator('input').filter({ has: page.locator('xpath=.') }).evaluateAll(es => es.filter(e => /^Re:|QA RPL/.test(e.value)).map(e => e.value));
  rec('RPL-B1', /customer-support@help-staging/.test(comp) ? 'PASS' : 'FAIL', 'From line: ' + from);
  rec('RPL-B3', recip.includes(QA_EMAIL) ? 'PASS' : 'FAIL', 'recipients: ' + recip.join(', '));
  rec('RPL-B5', 'INFO', `subject field: ${JSON.stringify(subj)}; ticket number ${num} in subject: ${subj.some(s => s.includes(String(num)))} (Zoho adds the ticket id by default)`);
  const sendDis = await page.getByRole('button', { name: 'Send', exact: true }).last().isDisabled(); const moreDis = await page.locator('button[aria-label="More send options"]').last().isDisabled();
  rec('RPL-B9', sendDis && moreDis ? 'PASS' : 'FAIL', `empty body: Send disabled=${sendDis}, More send options disabled=${moreDis}`);
  const ed = page.locator('[contenteditable=true]').last(); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA RPL C1 body. '); await sleep(800);
  await page.locator('button[aria-label="More send options"]').last().click(); await sleep(1500);
  const menu = await page.$$eval('[role=menuitem], [role=menuitemradio], [role=menu] button', ms => [...new Set(ms.filter(m => m.offsetParent !== null).map(m => (m.textContent || '').trim().replace(/\s+/g, ' ')).filter(Boolean))]);
  rec('RPL-F1', 'INFO', 'send options: ' + menu.join(' | '), { shot: await shot('RPL-F1-send-options') });
  await page.keyboard.press('Escape'); await sleep(500);
  net.length = 0; await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(6000);
  const rp = await api('GET', `/desk/tickets/${tk}/replies`); const out = ((rp.j && rp.j.data) || []).filter(r => r.direction === 'outbound');
  const r0 = out[0] || {};
  rec('RPL-C1', out.length === 1 && r0.is_public === true ? 'PASS' : 'FAIL', `outbound=${out.length} is_public=${r0.is_public} status=${r0.status} to=${JSON.stringify(r0.to)} cc=${JSON.stringify(r0.cc)} from=${r0.from_address} subject=${r0.subject} sent_at=${r0.sent_at}`);
  rec('RPL-C1-request', 'INFO', net.join(' || ').slice(0, 1500));
  const t1 = await api('GET', `/desk/tickets/${tk}`); const rec1 = (await recOf('tickets', tk)).o;
  rec('RPL-I1', t1.j.data.counts && t1.j.data.counts.replies === 1 ? 'PASS' : 'FAIL', 'counts=' + JSON.stringify(t1.j.data.counts));
  rec('RPL-I2/I3', 'INFO', `after reply: status=${t1.j.data.status} owner=${rec1.owner ? 'set' : 'unassigned'} response_due=${rec1.response_due}`);
  const hi = await api('GET', `/desk/tickets/${tk}/history`); rec('RPL-I5', /repl/i.test(hi.t) ? 'PASS' : 'FAIL', 'history mentions reply: ' + /repl/i.test(hi.t) + ' ' + hi.t.slice(0, 300));
  return fin({ tk, num, replyId: r0.id });
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('r1-error'); return fin(); }
