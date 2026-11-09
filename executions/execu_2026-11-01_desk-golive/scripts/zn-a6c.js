async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  const hdr = page.locator('xpath=//*[normalize-space(text())="Layouts"]/following::*[normalize-space(text())="Accounting"][1]'); o.n = await hdr.count();
  await hdr.first().click({ timeout: 8000 }).catch(e => o.e1 = e.message.slice(0, 60)); await page.waitForTimeout(1500);
  const s = page.locator('input[placeholder*="Search Departments"]:visible'); o.s = await s.count(); if (o.s) { await s.first().fill('Manual Invoice'); await page.waitForTimeout(1500); }
  const it = page.locator('xpath=//*[normalize-space(text())="Manual Invoice"]').filter({ visible: true }); o.items = await it.count();
  if (o.items) await it.last().click({ timeout: 8000 }).catch(e => o.e2 = e.message.slice(0, 60));
  await page.waitForTimeout(5000); o.text = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Layouts Tickets.{0,250}/)?.[0];
  await page.screenshot({ path: D + 'zoho-layouts-mi.png' }); return o; }
