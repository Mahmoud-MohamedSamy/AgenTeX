// D8 (Arabic Rename dialog) and K12 (custom module in tab bar / More / Organize Tabs). Temporary module QA MF Tab, deleted at the end; language set back to English.
const m = await mkModule('qa_mf_tab', 'QA MF Tab');
await step('K12', async () => {
  await go('/hq', 7000); const bar = (await page.locator('header, nav').first().innerText().catch(() => '')).includes('QA MF Tab');
  await page.mouse.click(546, 28); await sleep(1200); const more = (await txt()).includes('QA MF Tab'); const s1 = await shot('K12-more-menu'); await page.keyboard.press('Escape');
  await go('/settings/organize-tabs', 6000); const org = (await txt()).includes('QA MF Tab'); const s2 = await shot('K12-organize-tabs');
  rec('K12', (bar || more) && org ? 'PASS' : 'FAIL', `new module "QA MF Tab": in the tab bar=${bar}; in the "More" menu=${more}; listed in Organize Tabs=${org}`, { shot: s2 });
});
await step('D8', async () => {
  const lang = async name => { await page.getByRole('button', { name: /^(EN|AR|ع)/ }).first().click().catch(() => { }); await sleep(800); await page.locator('li[role=option] button', { hasText: name }).first().click().catch(() => { }); await sleep(3000); };
  await go('/settings/modules-and-fields', 6000); await lang('العربية'); await go('/settings/modules-and-fields', 7000);
  const dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
  const row = page.locator('tr', { hasText: 'QA MF Tab' }).first(); await row.hover(); await sleep(400);
  await page.locator('button[aria-label^="Open menu for QA MF Tab"]').first().click().catch(() => { }); await sleep(800);
  const menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ');
  await page.locator('[role=menuitem]').nth(1).click().catch(() => { }); await sleep(1500);
  const dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const latin = (dlg.match(/[A-Za-z][A-Za-z ]{3,}/g) || []).filter(w => !/QA MF Tab|qa_mf_tab|API/i.test(w)); const s = await shot('D8-arabic-rename');
  await page.keyboard.press('Escape'); await lang('English'); await go('/hq', 5000); const back = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
  rec('D8', dir === 'rtl' && dlg && latin.length === 0 ? 'PASS' : 'INFO', `Arabic: page direction ${dir}; row menu "${menu.slice(0, 160)}"; rename dialog "${dlg.slice(0, 260)}"; English words left in the dialog: ${JSON.stringify(latin).slice(0, 200)}; language set back to English (direction now ${back})`, { shot: s });
});
await step('K12.cleanup', async () => { const d = await api('DELETE', `/modules/${m.id}?cascade=true`); let purged = 0; const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=100'); const qa = arr(r.j && r.j.data && (r.j.data.items || r.j.data)).filter(i => /QA MF|qa_mf/.test(JSON.stringify(i))); if (qa.length) { const p = await api('POST', '/audit/recycle-bin/delete', { ids: qa.map(i => i.id) }); if (p.s < 300) purged = qa.length; } rec('K12.cleanup', d.s < 300 ? 'INFO' : 'FAIL', `QA MF Tab deleted → ${d.s}; recycle bin QA items purged ${purged}`); });
return done();
