async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000573001', { waitUntil: 'domcontentloaded' }).catch(() => {}); await sleep(12000);
  o.title = (await page.innerText('body')).replace(/\s+/g, ' ').match(/QA GL W2 zoho draft check #183/)?.[0] || ((await page.innerText('body')).includes('QA GL W2 zoho draft check') ? 'title ok' : 'NOT FOUND');
  if (!/ok|#183/.test(o.title)) return o;
  await page.locator('[data-title="More Actions (M)"]').first().click(); await sleep(2000);
  await page.locator('li', { hasText: /^Delete$/ }).first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(2500);
  o.dialog = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,80}(delete|Delete).{0,120}/g)?.slice(-2);
  await page.screenshot({ path: S + 'z-delete-confirm.png' });
  const yes = page.locator('button', { hasText: /^(Delete|Yes|Move to Trash|OK)$/ }).last(); o.yes = await yes.count(); if (o.yes) { await yes.click(); await sleep(6000); }
  o.after = page.url(); return o; }
