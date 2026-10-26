// RPL batch 7: ticket CC via side panel (capture), C4 via UI chip removal, snippets G4-G8, K5 approve own pending draft, F2 Send and Close + Send as private via UI
const CCX = 'qa.rpl.cc@example.com';
const L = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`); const tk = ((L.j.data.records || L.j.data.items || L.j.data) || []).map(fl).find(x => x.subject === 'QA RPL ticket 3').id;
const net = []; const onR = async r => { const q = r.request(); if (q.method() !== 'GET' && r.url().includes('/api/v1/') && !/viewers|read$|summaries|heartbeat|presence|resolved|realtime|iam\//.test(r.url())) net.push(q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 300) + ' -> ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); }; page.on('response', onR);
const s = r => r.s + ' ' + (r.j && r.j.error ? r.j.error.code + ' ' + r.j.error.message : 'ok').slice(0, 160);
const typeBody = async t => { const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type(t); await sleep(600); };
try {
  await go(`/modules/${M.tickets}/records/${tk}`, 10000);
  net.length = 0; await page.getByPlaceholder('Add an email address').fill(CCX); await page.getByRole('button', { name: 'Add', exact: true }).click(); await sleep(3000);
  const ccAdd = net.slice(0, 3); const cc1 = await api('GET', `/desk/tickets/${tk}/cc`);
  rec('RPL-C-ticketCC', cc1.t.includes(CCX) ? 'PASS' : 'FAIL', 'side panel add: ' + ccAdd.join(' || ').slice(0, 400));
  await go(`/modules/${M.tickets}/records/${tk}`, 9000);
  await page.locator('main button').filter({ hasText: /^Reply All/ }).first().click(); await sleep(4000);
  const chips = await page.$$eval('[aria-label^="Remove "]', bs => bs.map(b => b.getAttribute('aria-label').replace('Remove ', '')));
  rec('RPL-B3', chips.includes(CCX) ? 'PASS' : 'FAIL', 'Reply All pre-fills: ' + chips.join(', '));
  const rm = page.locator(`[aria-label="Remove ${CCX}"]`); if (await rm.count()) await rm.first().click(); await sleep(400);
  await typeBody('QA RPL C4d cc removed. '); net.length = 0; await page.getByRole('button', { name: 'Send', exact: true }).last().click(); await sleep(5000);
  const cc2 = await api('GET', `/desk/tickets/${tk}/cc`); const sent = net.find(x => /replies/.test(x)) || 'no POST';
  rec('RPL-C4', cc2.t.includes(CCX) && !/qa\.rpl\.cc@example\.com"\]/.test(sent.split('->')[0]) ? 'PASS' : 'FAIL', `ticket CC still has it: ${cc2.t.includes(CCX)}; sent: ${sent.slice(0, 250)}`);
  // F2 Send and Close via UI
  await go(`/modules/${M.tickets}/records/${tk}`, 9000); await page.locator('main button').filter({ hasText: /^Reply/ }).first().click(); await sleep(4000); await typeBody('QA RPL F2 send and close. ');
  net.length = 0; await page.locator('button[aria-label="More send options"]').last().click(); await sleep(1000); await page.getByRole('menuitem', { name: 'Send and Close' }).click(); await sleep(6000);
  const st = await api('GET', `/desk/tickets/${tk}`); rec('RPL-F2', st.j.data.status === 'Closed' ? 'PASS' : 'FAIL', `status after Send and Close: ${st.j.data.status}; net=${net.map(x => x.slice(0, 120)).join(' || ')}`);
  await api('POST', `/desk/tickets/${tk}/reopen`, {}); await sleep(1500);
  // Send as private via UI
  await go(`/modules/${M.tickets}/records/${tk}`, 9000); await page.locator('main button').filter({ hasText: /^Reply/ }).first().click(); await sleep(4000); await typeBody('QA RPL F3 send as private. ');
  net.length = 0; await page.locator('button[aria-label="More send options"]').last().click(); await sleep(1000); await page.getByRole('menuitem', { name: 'Send as private' }).click(); await sleep(6000);
  const rr = ((await api('GET', `/desk/tickets/${tk}/replies`)).j.data || []).find(r => /F3 send as private/.test(r.body_html || ''));
  rec('RPL-F3', rr && rr.is_public === false ? 'PASS' : 'FAIL', `reply is_public=${rr && rr.is_public} mode=${rr && rr.mode}; net=${net.map(x => x.slice(0, 160)).join(' || ')}`);
} catch (e) { rec('script-error', 'BLOCKED', String(e.message).slice(0, 300)); await shot('r7-error'); }
// snippets
const g4 = await api('POST', '/desk/snippets', { name: 'qa_rpl_snip', content_html: '<p>Hello {{customer_name}}, ticket {{ticket_number}}.</p>', is_shared: false });
const sid = g4.j && g4.j.data && (g4.j.data.id || (g4.j.data.snippet && g4.j.data.snippet.id));
rec('RPL-G4', g4.s === 201 ? 'PASS' : 'FAIL', `create ${s(g4)}`);
const g5 = {}; g5['duplicate'] = s(await api('POST', '/desk/snippets', { name: 'qa_rpl_snip', content_html: '<p>x</p>', is_shared: false })); g5['25601 chars'] = s(await api('POST', '/desk/snippets', { name: 'qa_rpl_long', content_html: 'z'.repeat(25601), is_shared: false })); g5['51-char name'] = s(await api('POST', '/desk/snippets', { name: 'q'.repeat(51), content_html: '<p>x</p>', is_shared: false }));
rec('RPL-G5', Object.values(g5).some(v => /^201/.test(v)) ? 'FAIL' : 'PASS', JSON.stringify(g5));
const rs = await api('POST', `/desk/tickets/${tk}/snippets/resolve`, { snippet_id: sid }); rec('RPL-G6', rs.s === 200 && !/\{\{/.test(rs.t) ? 'PASS' : 'FAIL', `resolve ${s(rs)} ${rs.t.slice(0, 220)}`);
// K5: approve own pending draft
await api('PUT', `/desk/tickets/${tk}/drafts/mine`, { mode: 'reply_all', to: [QA_EMAIL], subject: 'Re: QA RPL ticket 3', body_html: '<p>QA RPL K5 review</p>' });
await api('POST', `/desk/tickets/${tk}/drafts/mine/submit-review`, {}); const dl = await api('GET', `/desk/tickets/${tk}/drafts`); const did = ((dl.j && dl.j.data) || [])[0] && dl.j.data[0].id;
const ap = await api('POST', `/desk/tickets/${tk}/drafts/${did}/approve`, {}); rec('RPL-K5', ap.s === 403 ? 'PASS' : (ap.s < 300 ? 'FAIL' : 'INFO'), `agent approves own pending draft -> ${s(ap)}`);
if (ap.s >= 300) { await api('POST', `/desk/tickets/${tk}/drafts/mine/withdraw-review`, {}); await api('DELETE', `/desk/tickets/${tk}/drafts/mine`); }
const all = await api('GET', '/desk/snippets'); for (const x of ((all.j && all.j.data && all.j.data.snippets) || [])) if (/^qa_rpl/.test(x.name)) await api('DELETE', `/desk/snippets/${x.id}`);
page.off('response', onR);
return fin({ tk });
