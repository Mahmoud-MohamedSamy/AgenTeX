// RPL batch 3 (UI + API checks): comments, Cc, forward privacy, reply-all after forward, drafts, send-as-private
const tk = '4df60527-2c5c-4943-bae7-c4ce5967042c';
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/desk/tickets') && !/viewers|read$|summaries/.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API + '/desk/tickets/' + tk, '') + ' ' + (q.postData() || '').slice(0, 400) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); }; page.on('response', onR);
const reload = async () => { await go(`/modules/${M.tickets}/records/${tk}`, 10000); };
const typeBody = async t => { const ed = page.locator('[contenteditable=true]').last(); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type(t); await sleep(600); };
const replies = async () => ((await api('GET', `/desk/tickets/${tk}/replies`)).j.data || []);
const comments = async () => ((await api('GET', `/desk/tickets/${tk}/comments`)).j.data || []);
const sendMenu = async item => { await page.locator('button[aria-label="More send options"]').last().click(); await sleep(1200); await page.getByRole('menuitem', { name: item }).click(); await sleep(5000); };
try {
  // D1 private comment (default)
  await reload(); await page.getByRole('button', { name: /Comment \(Shift \+ C\)/ }).click(); await sleep(2500);
  await typeBody('QA RPL D1 private'); net.length = 0;
  await page.getByRole('button', { name: /^Comment ?Private$/ }).last().click(); await sleep(4000);
  let cs = await comments(); const d1 = cs.find(c => /QA RPL D1/.test(c.body_html || c.body || ''));
  rec('RPL-D1', d1 && d1.is_public === false ? 'PASS' : 'FAIL', 'is_public=' + (d1 && d1.is_public) + ' net=' + net.join(' || ').slice(0, 300));
  // D2 public comment
  await page.getByRole('button', { name: /Comment \(Shift \+ C\)/ }).click(); await sleep(2500); await typeBody('QA RPL D2 public');
  await page.getByRole('button', { name: 'Comment visibility' }).click(); await sleep(1000);
  const vis = await page.$$eval('[role=menuitem], [role=menuitemradio], [role=option]', ms => ms.map(m => (m.textContent || '').trim()));
  await page.getByRole('menuitemradio', { name: /Public/ }).or(page.getByRole('menuitem', { name: /Public/ })).first().click(); await sleep(800);
  await page.getByRole('button', { name: /^Comment ?(Public|Private)$/ }).last().click(); await sleep(4000);
  cs = await comments(); const d2 = cs.find(c => /QA RPL D2/.test(c.body_html || c.body || ''));
  rec('RPL-D2', d2 && d2.is_public === true ? 'PASS' : 'FAIL', 'visibility menu=' + vis.join('/') + ' is_public=' + (d2 && d2.is_public));
  // D3 edit + D4 delete via API (own comment), D5 pin
  if (d1) { const e = await api('PUT', `/desk/tickets/${tk}/comments/${d1.id}`, { body_html: '<p>QA RPL D1 private edited</p>', is_public: false }); const p = await api('PUT', `/desk/tickets/${tk}/comments/${d1.id}/pin`, {}); rec('RPL-D3/D5', e.s < 300 && p.s < 300 ? 'PASS' : 'FAIL', `edit ${e.s} ${e.t.slice(0, 120)} | pin ${p.s} ${p.t.slice(0, 160)}`); }
  if (d2) { const dd = await api('DELETE', `/desk/tickets/${tk}/comments/${d2.id}`); rec('RPL-D4', dd.s < 300 ? 'PASS' : 'FAIL', 'delete ' + dd.s); }
  const feed = await api('GET', `/desk/tickets/${tk}/activity`); rec('RPL-I5-comments', 'INFO', 'feed actions: ' + [...new Set(((feed.j && feed.j.data) || []).map(a => a.action))].join(', '));
  // C3 Reply All with Cc
  await reload(); await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000);
  const ccIn = page.locator('main input[placeholder="Cc"], main [aria-label="Cc"] input, main input[aria-label="Cc"]').first();
  await ccIn.fill(QA_CC); await page.keyboard.press('Enter'); await sleep(600);
  await typeBody('QA RPL C3 with cc. '); net.length = 0; await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(5000);
  let rs = await replies(); const c3 = rs.find(r => /QA RPL C3/.test(r.body_html || ''));
  const ccList = await api('GET', `/desk/tickets/${tk}/cc`);
  rec('RPL-C3', c3 && (c3.cc || []).includes(QA_CC) ? 'PASS' : 'FAIL', `reply cc=${JSON.stringify(c3 && c3.cc)}; ticket CC list after: ${ccList.t.slice(0, 200)}`);
  // C4 Reply All removing the Cc chip -> ticket CC list unchanged
  await reload(); await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000);
  const ccChips = await page.$$eval('[aria-label^="Remove "]', bs => bs.map(b => b.getAttribute('aria-label')));
  const rm = page.locator(`[aria-label="Remove ${QA_CC}"]`); const hadChip = await rm.count(); if (hadChip) await rm.first().click(); await sleep(500);
  await typeBody('QA RPL C4 cc removed. '); await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(5000);
  rs = await replies(); const c4 = rs.find(r => /QA RPL C4/.test(r.body_html || '')); const cc2 = await api('GET', `/desk/tickets/${tk}/cc`);
  rec('RPL-C4', c4 && !(c4.cc || []).includes(QA_CC) && cc2.t.includes(QA_CC) ? 'PASS' : 'FAIL', `chips on Reply All: ${ccChips.join(', ')}; reply cc=${JSON.stringify(c4 && c4.cc)}; ticket CC still has it: ${cc2.t.includes(QA_CC)}`);
  // C6 Forward to QA_CC -> private
  await reload(); await page.getByRole('button', { name: 'More ways to reply' }).click(); await sleep(1000); await page.getByRole('menuitem', { name: 'Forward' }).click(); await sleep(4000);
  const toIn = page.locator('main input[placeholder*="ecipient" i], main input[aria-label*="ecipient" i], main input[placeholder="To"]').first(); await toIn.fill(QA_CC); await page.keyboard.press('Enter'); await sleep(500);
  await typeBody('QA RPL C6 forward. '); await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(5000);
  rs = await replies(); const c6 = rs.find(r => /QA RPL C6/.test(r.body_html || ''));
  rec('RPL-C6', c6 && c6.is_public === false && c6.mode === 'forward' ? 'PASS' : 'FAIL', `mode=${c6 && c6.mode} is_public=${c6 && c6.is_public} to=${JSON.stringify(c6 && c6.to)}`);
  // C7 Reply All after forward (regression NDC-1838)
  await reload(); await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000);
  const chips7 = await page.$$eval('[aria-label^="Remove "]', bs => bs.map(b => b.getAttribute('aria-label').replace('Remove ', '')));
  const body7 = await page.locator('[contenteditable=true]').last().innerText();
  rec('RPL-C7', !/QA RPL C6/.test(body7) ? 'PASS' : 'FAIL', `recipients on Reply All after forward: ${chips7.join(', ')}; quotes forward: ${/QA RPL C6/.test(body7)}`);
  await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(800); const dsc = page.getByRole('button', { name: /Discard/ }); if (await dsc.count()) await dsc.first().click();
  // F: Send as private
  await reload(); await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000); await typeBody('QA RPL F send as private. ');
  await sendMenu('Send as private'); rs = await replies(); const fp = rs.find(r => /send as private/.test(r.body_html || ''));
  rec('RPL-F-private', fp && fp.is_public === false ? 'PASS' : 'FAIL', 'is_public=' + (fp && fp.is_public) + ' status=' + (fp && fp.status));
  // E1/E2/E4 drafts
  await reload(); await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000); await typeBody('QA RPL E1 draft text. ');
  await page.getByRole('button', { name: 'Save draft' }).click(); await sleep(3000); const dr = await api('GET', `/desk/tickets/${tk}/drafts`);
  rec('RPL-E1', /QA RPL E1 draft/.test(dr.t) ? 'PASS' : 'FAIL', 'drafts after Save draft: ' + dr.t.slice(0, 250));
  await reload(); const ind = (await txt()).match(/[Dd]raft[^\n]{0,60}/g); await page.locator('main button').filter({ hasText: /^Reply All$/ }).first().click(); await sleep(4000);
  const resumed = await page.locator('[contenteditable=true]').last().innerText(); const resumeDlg = (await txt()).match(/Resume[^\n]{0,80}/);
  rec('RPL-E2', /QA RPL E1 draft/.test(resumed) ? 'PASS' : 'FAIL', `indicator on ticket: ${JSON.stringify(ind)}; composer restored draft: ${/QA RPL E1 draft/.test(resumed)}; prompt: ${JSON.stringify(resumeDlg)}`, { shot: await shot('RPL-E2-resume') });
  await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(1000);
  const dbtn = await page.$$eval('[role=dialog] button, [role=alertdialog] button', bs => bs.map(b => b.innerText.trim())); const dsc2 = page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /Discard/ }); if (await dsc2.count()) { await dsc2.first().click(); await sleep(2500); }
  const dr2 = await api('GET', `/desk/tickets/${tk}/drafts`); rec('RPL-E4', !/QA RPL E1 draft/.test(dr2.t) ? 'PASS' : 'INFO', `cancel dialog buttons: ${dbtn.join('/')}; drafts after discard: ${dr2.t.slice(0, 150)}`);
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('r3-error'); }
page.off('response', onR);
return fin();
