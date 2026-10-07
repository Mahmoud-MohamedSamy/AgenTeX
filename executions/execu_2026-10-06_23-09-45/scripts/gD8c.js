await step('D8', async () => {
  const lang = async name => { await page.getByRole('button', { name: /^(EN|AR|ع)/ }).first().click().catch(() => { }); await sleep(800); await page.locator('li[role=option] button', { hasText: name }).first().click().catch(() => { }); await sleep(3000); };
  await go('/settings/modules-and-fields', 6000); await lang('العربية'); await go('/settings/modules-and-fields', 8000);
  const row = page.locator('tr', { hasText: 'Ticket' }).first(); await row.hover(); await sleep(600);
  const b = page.locator('button[aria-label^="فتح القائمة"]').first(); await b.click({ force: true }); await sleep(1500);
  const t1 = (await txt()); const s1 = await shot('D8-arabic-row-menu');
  const rn = page.getByText(/إعادة التسمية|إعادة تسمية|Rename/).first(); const has = await rn.count(); if (has) { await rn.click(); await sleep(2000); }
  const dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); const latin = (dlg.match(/[A-Za-z][A-Za-z ]{3,}/g) || []).filter(w => !/Tickets?|desk_tickets|API/i.test(w));
  const s2 = await shot('D8-arabic-rename'); await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape');
  await lang('English'); await go('/hq', 5000); const back = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
  rec('D8', dlg ? (latin.length ? 'FAIL' : 'PASS') : 'INCONCLUSIVE', `Arabic: Rename item found=${has > 0}; dialog "${dlg.slice(0, 300)}"; English words left ${JSON.stringify(latin).slice(0, 200)}; back to English (dir ${back})`, { shot: dlg ? s2 : s1 });
});
return done();
