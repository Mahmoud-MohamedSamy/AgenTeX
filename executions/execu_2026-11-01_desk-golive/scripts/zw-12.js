async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.locator('[data-id="contactId"]').fill('QA GL W2 Zoho'); await sleep(2500); await page.keyboard.press('Escape'); await sleep(500);
  await page.locator('[data-id="email"]').fill('mmohamed@anyware.software'); await sleep(500);
  await page.locator('[data-id="subject"]').fill('QA GL W2 zoho draft check'); await sleep(500);
  const d = page.locator('[data-id="description"]'); if (await d.count()) await d.fill('Go-live wave 2 parity check, safe to delete.').catch(() => {});
  await page.screenshot({ path: S + 'z-add-filled.png' });
  o.btns = await page.$$eval('button', bs => bs.filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(Boolean).slice(-8));
  const sub = page.locator('button', { hasText: /^Submit$/ }).last(); o.sub = await sub.count(); if (o.sub) { await sub.click(); await sleep(9000); }
  o.url = page.url(); o.head = (await page.innerText('body')).replace(/\s+/g, ' ').match(/QA GL W2 zoho draft check.{0,120}/)?.[0];
  await page.screenshot({ path: S + 'z-ticket-created.png' });
  return o; }
