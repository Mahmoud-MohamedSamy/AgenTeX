async (page) => {
  const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  const ids = await page.evaluate(() => [...document.querySelectorAll('[id^=ajaxEdit_]')].map(e => e.id).slice(0, 40));
  const t = ids.find(i => /INDUSTRY/i.test(i)); if (!t) return { ids };
  await page.locator('#' + t).scrollIntoViewIfNeeded(); await page.locator('#' + t).click(); await page.waitForTimeout(2000);
  await page.screenshot({ path: EVd + 'zoho-G4-open.png' });
  const opt = page.getByText('ASP (Application Service Provider)', { exact: true }); const n = await opt.count();
  if (n) { for (let i = n - 1; i >= 0; i--) if (await opt.nth(i).isVisible()) { await opt.nth(i).click(); break; } }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: EVd + 'zoho-G4-picked.png' });
  const btns = (await page.locator('button:visible, [role=button]:visible').allInnerTexts()).map(s => s.trim()).filter(s => s && s.length < 25).slice(0, 30);
  return { t, n, btns, body: (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,200}Fax.{0,200}/)?.[0] };
}
