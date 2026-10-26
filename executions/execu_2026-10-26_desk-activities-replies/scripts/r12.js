// RPL batch 12: discard open composer, H1 attachment sent, G1 template insert, G3 rating link insert, J2 make private
const tk = '60e81b1b-e8ae-4a5d-aad9-70b69d9624b9';
const FILE = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/78e9ef04-c27b-42b4-8452-a5ad34c618c7/scratchpad/files/qa-rpl-attach.txt';
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/') && !/viewers|read$|summaries|heartbeat|presence|resolved|realtime|iam\/|lookups/.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').replace(/<!--desk-quote-->[\s\S]*$/, '…').slice(0, 250) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); }; page.on('response', onR);
const typeBody = async t => { const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type(t); await sleep(600); };
try {
  await go(`/modules/${M.tickets}/records/${tk}`, 4000);
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('desk.composer.draft:')) localStorage.removeItem(k); });
  await go(`/modules/${M.tickets}/records/${tk}`, 9000);
  // H1 attachment
  await page.locator('main button').filter({ hasText: /^Reply/ }).first().click(); await sleep(4000); await typeBody('QA RPL H1 with attachment. ');
  const fin_ = page.locator('main input[type=file]'); const nfi = await fin_.count(); if (nfi) { await fin_.last().setInputFiles(FILE); } await sleep(4000);
  const att = await page.$$eval('main *', es => es.filter(e => e.children.length === 0 && /qa-rpl-attach/.test(e.textContent || '')).map(e => e.textContent.trim()));
  net.length = 0; await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(6000);
  const rp = ((await api('GET', `/desk/tickets/${tk}/replies`)).j.data || []).find(r => /H1 with attachment/.test(r.body_html || ''));
  rec('RPL-H1', rp && (rp.attachments || []).length === 1 ? 'PASS' : 'FAIL', `chip=${JSON.stringify(att)} reply attachments=${JSON.stringify(rp && rp.attachments).slice(0, 200)} net=${net.join(' || ').slice(0, 400)}`);
  // G1 template insert (no send)
  await go(`/modules/${M.tickets}/records/${tk}`, 9000); await page.locator('main button').filter({ hasText: /^Reply/ }).first().click(); await sleep(4000);
  await page.getByRole('button', { name: 'Insert template' }).click(); await sleep(2000);
  const tpl = await page.$$eval('[role=dialog] *, [role=listbox] *, [role=menu] *', es => [...new Set(es.filter(e => e.children.length === 0).map(e => (e.textContent || '').trim()).filter(Boolean))]).catch(() => []);
  await shot('RPL-G1-templates'); rec('RPL-G1', 'INFO', 'template picker: ' + tpl.slice(0, 25).join(' | '));
  await page.keyboard.press('Escape'); await sleep(500);
  // G3 rating link insert
  const sel = page.locator('main select').filter({ has: page.locator('option', { hasText: 'Rating link' }) }).first();
  if (await sel.count()) { const v = await sel.evaluate(s => [...s.options].find(o => /Rating link/.test(o.text)).value); await sel.selectOption(v); await sleep(1500); }
  const body = await page.locator('[aria-label="Reply body"]').innerHTML(); rec('RPL-G3', /rating|happiness|rate/i.test(body) ? 'PASS' : 'FAIL', 'body after Rating link: ' + body.replace(/<!--desk-quote-->[\s\S]*$/, '').slice(0, 300));
  await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(800); const d = page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /Discard/ }); if (await d.count()) await d.first().click();
  // J2 make private on the H1 reply via entry menu
  await go(`/modules/${M.tickets}/records/${tk}`, 9000); net.length = 0;
  const entry = page.locator('main').locator('text=QA RPL H1 with attachment').first(); await entry.scrollIntoViewIfNeeded().catch(() => {});
  const menus = page.getByRole('button', { name: 'Conversation entry actions' }); const n = await menus.count(); let opened = false;
  for (let i = 0; i < n && !opened; i++) { const box = await menus.nth(i).boundingBox(); const eb = await entry.boundingBox(); if (box && eb && Math.abs(box.y - eb.y) < 140) { await menus.nth(i).click(); opened = true; } }
  if (!opened) await menus.first().click(); await sleep(1000);
  const items = await page.$$eval('[role=menuitem]', ms => ms.map(m => m.textContent.trim()));
  await page.getByRole('menuitem', { name: 'Make private' }).click().catch(() => {}); await sleep(2500);
  const dlg = await page.$$eval('[role=dialog], [role=alertdialog]', ds => ds.map(x => x.innerText.replace(/\s+/g, ' ')).join('|')); if (dlg) { await page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /Make private|Confirm|Yes/i }).last().click().catch(() => {}); await sleep(2500); }
  const toast = await page.$$eval('[data-sonner-toast]', ts => ts.map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => '');
  const rp2 = ((await api('GET', `/desk/tickets/${tk}/replies`)).j.data || []).find(r => /H1 with attachment/.test(r.body_html || ''));
  rec('RPL-J2', rp2 && rp2.is_public === false ? 'PASS' : 'INFO', `menu=${items.join('/')} dialog="${dlg.slice(0, 120)}" toast="${toast}" is_public now=${rp2 && rp2.is_public} net=${net.join(' || ').slice(0, 300)}`);
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('r12-error'); }
page.off('response', onR);
return fin();
