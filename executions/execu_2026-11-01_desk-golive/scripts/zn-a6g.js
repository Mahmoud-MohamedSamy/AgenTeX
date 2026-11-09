async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  const f = page.frames().find(x => /ShowHomePage\.do/.test(x.url()));
  o.inputs = await f.evaluate(() => [...document.querySelectorAll('input')].filter(i => i.offsetParent).map(i => [i.placeholder, i.type, i.className.slice(0, 40)]));
  const s = f.locator('input[placeholder*="earch"]').filter({ visible: true }).last(); if (await s.count()) { await s.click(); await s.pressSequentially('Manual', { delay: 80 }); await page.waitForTimeout(2500); }
  o.after = (await f.innerText('body')).replace(/\s+/g, ' ').match(/DEPARTMENTS.{0,200}/)?.[0];
  o.r = await f.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /Manual/.test(e.textContent)).map(e => e.tagName + ':' + e.textContent.trim().slice(0, 30)).slice(0, 8));
  const it = f.getByText(/^Manual\s+Invoice$/); o.items = await it.count();
  for (let i = o.items - 1; i >= 0; i--) { const el = it.nth(i); if (await el.isVisible()) { await el.click({ timeout: 5000 }).catch(e => o.e2 = e.message.slice(0, 60)); o.clicked = i; break; } }
  await page.waitForTimeout(5000); o.text = (await f.innerText('body')).replace(/\s+/g, ' ').match(/Layouts Tickets.{0,250}/)?.[0];
  await page.screenshot({ path: D + 'zoho-layouts-mi.png' }); return o; }
