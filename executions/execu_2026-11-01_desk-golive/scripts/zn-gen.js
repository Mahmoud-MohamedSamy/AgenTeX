async (page) => { const A = {url:'https://desk.zoho.com/agent/wondertravel/all/setup#setup/automation/589783000051292535/workflows/rules',out:'a1/zoho-fa-wf',from:330,len:300}; const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/';
  if (A.url) { await page.goto(A.url, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(A.wait || 25000); }
  const x = page.locator('text=Desktop Notification').locator('xpath=ancestor::div[3]').locator('text=/^×$/'); if (await x.count()) await x.first().click().catch(() => {});
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  for (const c of (A.clicks || [])) { const r = f.getByText(c, { exact: true }).first(); if (await r.count()) { await r.scrollIntoViewIfNeeded().catch(() => {}); await r.click().catch(() => {}); await page.waitForTimeout(5000); } else o.miss = (o.miss || []).concat(c); }
  if (A.scroll) { await page.mouse.move(900, 500); await page.mouse.wheel(0, A.scroll); await page.waitForTimeout(1500); }
  o.t = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(A.from || 0, (A.from || 0) + (A.len || 1200));
  await page.screenshot({ path: D + A.out + '.png' }); return o; }
