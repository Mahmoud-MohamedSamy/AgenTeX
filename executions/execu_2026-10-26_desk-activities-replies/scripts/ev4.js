// R-B1 / R-B2 evidence on the new build. No reply is sent. QA ticket closed at the end, local draft removed.
await page.setViewportSize({ width: 1600, height: 900 });
const out = {}; const CCX = 'qa.rpl.cc@example.com';
const r = async (sel, src) => page.evaluate(([sel, src]) => { const re = src ? new RegExp(src) : null; return [...document.querySelectorAll(sel)].filter(e => e.offsetParent !== null && (!re || re.test((e.textContent || e.getAttribute('aria-label') || '').trim()))).slice(0, 4).map(e => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }); }, [sel, src || null]);
try {
  const tk = (await mk('tickets', { subject: 'QA RPL EV cc and draft', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }, 'ev')).id; out.tk = tk;
  await go(`/modules/${M.tickets}/records/${tk}`, 10000);
  await page.getByPlaceholder('Add an email address').fill(CCX); await page.getByRole('button', { name: 'Add', exact: true }).click(); await sleep(3000);
  out.ccApi = (await api('GET', `/desk/tickets/${tk}/cc`)).t.includes(CCX);
  await go(`/modules/${M.tickets}/records/${tk}`, 10000);
  await page.locator('main button').filter({ hasText: /^Reply All/ }).first().click(); await sleep(5000);
  out.chips = await page.$$eval('[aria-label^="Remove "]', bs => bs.map(b => b.getAttribute('aria-label')));
  out.rb1 = { s: await shot('ev-R-B1-tavi'), ccPanel: await r('main *', '^Copied on this ticket'), ccRow: await r('main span, main div', '^qa\\.rpl\\.cc@example'), recipients: await r('main div', '^Recipients'), ccField: await r('main div', '^Cc$') };
  // R-B2: type, Save draft
  const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA RPL EV draft text. '); await sleep(800);
  const net = []; const f = q => { if (q.method() !== 'GET' && q.url().includes('/drafts')) net.push(q.method() + ' ' + q.url().replace(API, '')); }; page.on('request', f);
  await page.getByRole('button', { name: 'Save draft' }).click(); await sleep(4000); page.off('request', f);
  out.rb2 = { s: await shot('ev-R-B2-tavi'), saveBtn: await r('main button', '^Save draft$'), net, mine: (await api('GET', `/desk/tickets/${tk}/drafts/mine`)).t.slice(0, 200), ls: await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('desk.composer.draft:'))) };
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('desk.composer.draft:')) localStorage.removeItem(k); });
  await go(`/modules/${M.tickets}/records/${tk}`, 4000);
  await api('POST', `/desk/tickets/${tk}/close`, {});
} catch (e) { out.err = String(e.message).slice(0, 300); await shot('ev4-error'); }
return JSON.stringify(out);
