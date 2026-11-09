async (page) => { const o = {}; const A = __ZA__;
  const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/';
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup#setup/automation/' + A.dept + '/workflows/rules', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(30000);
  const x = page.locator('text=Desktop Notification').locator('xpath=ancestor::div[3]').locator('text=/^×$/'); if (await x.count()) await x.first().click().catch(() => {});
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  o.list = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').match(/Workflow.{0,400}/)?.[0];
  await page.screenshot({ path: D + A.out + '-list.png' });
  if (A.rule) { const r = f.getByText(A.rule, { exact: true }).first(); o.found = await r.count(); if (o.found) { await r.scrollIntoViewIfNeeded().catch(() => {}); await r.click().catch(e => o.e = e.message.slice(0, 60)); await page.waitForTimeout(6000); }
    o.detail = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500);
    await page.screenshot({ path: D + A.out + '-rule.png' }); }
  return o; }
