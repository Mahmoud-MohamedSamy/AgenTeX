(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  await page.fill('#ZD_15', 'QA GL dup check'); await page.fill('#ZD_16', 'hmohammed@anyware.software'); await page.locator('#ZD_16').press('Tab'); await page.waitForTimeout(4000);
  const t = (await page.innerText('body')).replace(/\s+/g, ' ');
  o.msgs = t.match(/.{0,80}(already|exist|registered|in use|valid|associated)[^.]{0,80}/ig) || [];
  await page.screenshot({ path: R + 'zoho-B3-3-existing-email-typed.png' });
  await page.getByRole('button', { name: /^Cancel$/ }).first().click().catch(e => o.cancelErr = e.message.slice(0, 80)); await page.waitForTimeout(3000);
  const d = page.getByText(/Discard|Yes|Leave/).first(); if (await d.count()) { o.discard = await d.innerText().catch(() => ''); await d.click().catch(() => {}); await page.waitForTimeout(2000); }
  o.after = page.url(); o.agents = (await page.innerText('body')).replace(/\s+/g, ' ').match(/ACTIVE AGENTS \(\d+\)/)?.[0];
  return o; })
