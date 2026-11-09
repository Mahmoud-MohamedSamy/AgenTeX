async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  const f = page.frames().find(x => /ShowHomePage\.do/.test(x.url()));
  const hdr = f.locator('xpath=//*[normalize-space(text())="Layouts"]/following::*[normalize-space(text())="Accounting"][1]'); o.n = await hdr.count();
  await hdr.first().click({ timeout: 8000 }).catch(e => o.e1 = e.message.slice(0, 60)); await page.waitForTimeout(1500);
  const s = f.locator('input[placeholder*="Search Departments"]'); o.s = await s.count(); if (o.s) { await s.last().fill('Manual Invoice').catch(e=>o.e3=e.message.slice(0,60)); await page.waitForTimeout(1500); }
  const it = f.locator('xpath=//*[normalize-space(text())="Manual Invoice"]'); o.items = await it.count();
  for (let i = o.items - 1; i >= 0; i--) { if (await it.nth(i).isVisible()) { await it.nth(i).click({ timeout: 5000 }).catch(e => o.e2 = e.message.slice(0, 60)); break; } }
  await page.waitForTimeout(5000); o.text = (await f.innerText('body')).replace(/\s+/g, ' ').match(/Layouts Tickets.{0,250}/)?.[0];
  await page.screenshot({ path: D + 'zoho-layouts-mi.png' }); return o; }
