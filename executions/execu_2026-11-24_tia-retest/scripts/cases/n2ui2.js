const tid = id => page.locator(`[data-testid="${id}"]`);
const R = {};
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(2500);
R.pageHasTopicText = (await text()).includes('Topic rules are checked by AI');
await tid('tia-summary-card').locator('button', { hasText: 'Edit' }).click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last();
for (const tab of ['Tools', 'Additional Settings']) {
  await dlg.locator('[role=tab], button', { hasText: new RegExp('^' + tab + '$') }).first().click(); await sleep(1500);
  const t = await dlg.innerText(); R[tab] = t.replace(/\n+/g, ' / ').slice(0, 3500);
  R[tab + '_topic'] = t.includes('Topic rules are checked by AI');
  await shot('N2-' + tab.replace(/ /g, ''), {});
}
await dlg.locator('button', { hasText: /^Cancel$/ }).first().click(); await sleep(1500);
const conf = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Discard|Leave/i }); if (await conf.count()) { await conf.first().click(); await sleep(1000); }
R.closed = !(await page.locator('[role=dialog]').count());
return R;
