const { openEditor } = require('./lib-ed');
const unnamed = (page) => page.locator('main').last().evaluate(root => {
  const els = [...root.querySelectorAll('button, a[href], input, select, textarea, [role=button], [role=combobox], [role=checkbox]')];
  const vis = els.filter(e => e.offsetParent !== null);
  const bad = vis.filter(e => { const n = (e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.innerText || e.getAttribute('title') || e.getAttribute('placeholder') || (e.id && document.querySelector('label[for="' + e.id + '"]') ? 'l' : '') || (e.closest('label') ? 'l' : '')).trim(); return !n; });
  return { total: vis.length, unnamed: bad.length, samples: bad.slice(0, 6).map(e => e.outerHTML.slice(0, 140)) };
});
module.exports = async (h) => {
  const { page, ctx, go, shot, log, BASE } = h;
  // O9 English
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(3).waitFor();
  log('O9_list', await unnamed(page));
  // O8 keyboard: focus search, tab to New Rule, Enter, Escape
  await page.getByPlaceholder('Search rules…').focus();
  let found = false; for (let i = 0; i < 12; i++) { await page.keyboard.press('Shift+Tab'); const t = await page.evaluate(() => document.activeElement && document.activeElement.innerText); if (/New Rule/.test(t || '')) { found = true; break; } }
  log('O8_reachNewRule', found);
  if (found) { await page.keyboard.press('Enter'); await page.waitForTimeout(800); log('O8_wizardOpen', await page.getByRole('dialog').count()); await page.keyboard.press('Tab'); log('O8_focusInDialog', await page.evaluate(() => !!document.activeElement.closest('[role=dialog]'))); await page.keyboard.press('Escape'); await page.waitForTimeout(500); log('O8_escCloses', !(await page.getByRole('dialog').count())); }
  await openEditor(h, 'QA AO WF O9 editor', 'Create');
  log('O9_editor', await unnamed(page));
  // O10 narrow
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1500);
  log('O10_editor_overflow', await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })));
  await shot('s27-editor-390', { full: true });
  await go('/settings/automation/workflow-rules'); await page.waitForTimeout(3000);
  log('O10_list_overflow', await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })));
  await shot('s27-list-390', { full: false });
  await page.setViewportSize({ width: 1440, height: 900 });
  // O7 Arabic
  await page.evaluate(() => { try { localStorage.setItem('anyware_language', 'ar'); } catch (e) {} });
  await ctx.addCookies([{ name: 'anyware_language', value: 'ar', url: BASE }]);
  await go('/settings/automation/workflow-rules'); await page.waitForTimeout(4000);
  log('O7_dir', await page.evaluate(() => [document.documentElement.dir, document.documentElement.lang, getComputedStyle(document.body).direction]));
  log('O7_text', (await page.locator('main').last().innerText()).split('\n').filter(Boolean).slice(-14));
  await shot('s27-list-ar');
  await openEditor(h, 'QA AO WF O7 editor', null).catch(e => log('O7_editorErr', String(e).slice(0, 120)));
  await shot('s27-editor-ar', { full: true });
  log('O7_editorText', (await page.locator('body').innerText()).split('\n').filter(Boolean).slice(0, 30));
  // restore English
  await page.evaluate(() => { try { localStorage.setItem('anyware_language', 'en'); } catch (e) {} });
  await ctx.addCookies([{ name: 'anyware_language', value: 'en', url: BASE }]);
};
