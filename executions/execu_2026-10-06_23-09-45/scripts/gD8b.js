await step('BIN', async () => { const all = []; let cursor = null; for (let p = 0; p < 20; p++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&limit=100${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`); const it = arr(r.j && r.j.data && (r.j.data.items || r.j.data)); all.push(...it); cursor = r.j && r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
  const qa = all.filter(i => /QA MF|qa_mf/.test(JSON.stringify(i))); const kinds = {}; for (const i of qa) { const k = i.entity_type || i.entityType || i.type || '?'; kinds[k] = (kinds[k] || 0) + 1; }
  rec('BIN', 'INFO', `bin items ${all.length}; QA items ${qa.length} by type ${JSON.stringify(kinds)}; sample ${JSON.stringify(qa[0] || {}).slice(0, 300)}`); });
await step('D8', async () => {
  const lang = async name => { await page.getByRole('button', { name: /^(EN|AR|ع)/ }).first().click().catch(() => { }); await sleep(800); await page.locator('li[role=option] button', { hasText: name }).first().click().catch(() => { }); await sleep(3000); };
  await go('/settings/modules-and-fields', 6000); await lang('العربية'); await go('/settings/modules-and-fields', 7000);
  const row = page.locator('tr').filter({ has: page.locator('td') }).nth(0); await row.hover(); await sleep(500); const btns = row.locator('button'); const n = await btns.count();
  const labels = await btns.evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.innerText));
  await btns.nth(n - 2).click().catch(() => { }); await sleep(900); const items = await page.locator('[role=menuitem]').allInnerTexts();
  const ri = page.locator('[role=menuitem]').filter({ hasText: /إعادة تسمية|Rename/ }).first(); if (await ri.count()) await ri.click(); else await page.locator('[role=menuitem]').nth(1).click().catch(() => { }); await sleep(1500);
  const dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); const latin = (dlg.match(/[A-Za-z][A-Za-z ]{3,}/g) || []).filter(w => !/Tickets|Ticket|desk_tickets|API/i.test(w));
  const s = await shot('D8-arabic-rename'); await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape');
  await lang('English'); await go('/hq', 5000); const back = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
  rec('D8', dlg && latin.length === 0 ? 'PASS' : (dlg ? 'FAIL' : 'INFO'), `Arabic row buttons ${JSON.stringify(labels).slice(0, 160)}; menu ${JSON.stringify(items).slice(0, 200)}; rename dialog "${dlg.slice(0, 300)}"; English left: ${JSON.stringify(latin).slice(0, 200)}; back to English (dir ${back})`, { shot: s });
});
return done();
