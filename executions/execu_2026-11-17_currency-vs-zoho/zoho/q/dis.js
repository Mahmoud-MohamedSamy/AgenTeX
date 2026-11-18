async (page) => {
  await page.locator(':text-is("Disable"):visible').first().click(); await page.waitForTimeout(2500);
  const checked = await page.evaluate(() => [...document.querySelectorAll('input[type=checkbox]')].filter(e => e.offsetParent || e.closest('lyte-checkbox')).map(e => e.checked));
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/z24-prefs-restored.png' });
  const t = await page.innerText('body'); return { checked, addModuleShown: t.includes('Add Module') };
}
