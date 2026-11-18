async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(820, 523); await page.waitForTimeout(1500);
  await page.screenshot({ path: R + 'z11-add-manual.png' });
  let t = await page.innerText('body'); out.manual = t.slice(t.lastIndexOf('Update Type'), t.lastIndexOf('Update Type') + 300);
  // try an empty / invalid rate first
  const inp = page.locator('input:visible').filter({ hasNot: page.locator('[type=radio]') });
  const rate = page.locator('lyte-input:visible input, input[type=text]:visible').last();
  await rate.fill(''); await page.locator(':text-is("Save"):visible').last().click(); await page.waitForTimeout(1500);
  t = await page.innerText('body'); out.emptySave = t.slice(t.lastIndexOf('Update Type'), t.lastIndexOf('Update Type') + 300);
  await page.screenshot({ path: R + 'z12-empty-rate.png' });
  await rate.fill('0'); await page.locator(':text-is("Save"):visible').last().click(); await page.waitForTimeout(1500);
  t = await page.innerText('body'); out.zeroSave = t.slice(t.lastIndexOf('Update Type'), t.lastIndexOf('Update Type') + 300);
  await page.screenshot({ path: R + 'z13-zero-rate.png' });
  return out;
}
