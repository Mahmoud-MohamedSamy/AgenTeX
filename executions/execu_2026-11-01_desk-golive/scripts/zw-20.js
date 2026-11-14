async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.mouse.click(1574, 72); await sleep(1500);
  await page.locator('[data-title="My Information (U)"]').first().click(); await sleep(2500);
  await page.getByText('My Profile', { exact: true }).first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(9000);
  o.url = page.url(); const t = (await page.innerText('body')).replace(/\s+/g, ' '); o.sig = t.match(/Signature.{0,300}/)?.[0]; o.top = t.slice(0, 300);
  await page.screenshot({ path: S + 'z-myprofile.png' }); return o; }
