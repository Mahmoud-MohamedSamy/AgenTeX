async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  await page.locator('text=Desktop Notification').locator('xpath=ancestor::div[1]/..').locator('text=×').first().click({ timeout: 3000 }).catch(() => {});
  await page.keyboard.press('Escape').catch(() => {});
  await page.locator('text=/^Accounting$/').first().click().catch(e => o.e1 = e.message.slice(0, 80));
  await page.waitForTimeout(2000);
  const inp = page.locator('input[type=text]:visible').last(); await inp.fill('Manual Invoice').catch(() => {}); await page.waitForTimeout(2000);
  o.opts = await page.$$eval('li', ls => ls.filter(l => l.offsetParent && /Manual Invoice/.test(l.innerText)).map(l => l.innerText.trim()).slice(0, 5));
  await page.locator('li:visible', { hasText: /^Manual Invoice$/ }).first().click().catch(e => o.e2 = e.message.slice(0, 80));
  await page.waitForTimeout(5000);
  o.text = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Layouts Tickets.{0,300}/)?.[0];
  await page.screenshot({ path: D + 'zoho-layouts-mi.png' }); return o; }
