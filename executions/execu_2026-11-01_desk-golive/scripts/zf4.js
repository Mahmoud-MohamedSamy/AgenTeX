(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  await page.getByText('New Agent', { exact: true }).first().click().catch(e => o.e1 = e.message.slice(0, 80));
  await page.waitForTimeout(10000);
  o.inputs = await page.$$eval('input', is => is.filter(i => i.offsetParent).map(i => (i.id || '') + '|' + (i.name || '') + '|' + (i.placeholder || '') + '|' + i.type).slice(0, 30));
  await page.screenshot({ path: R + 'zoho-B3-2-new-agent-form.png' });
  const em = page.locator('input[type=email], input[placeholder*="mail" i], input[name*="mail" i]').first();
  o.emCount = await em.count();
  if (o.emCount) { await em.fill('hmohammed@anyware.software'); await page.waitForTimeout(800); await em.press('Tab'); await page.waitForTimeout(3000); }
  const t = (await page.innerText('body')).replace(/\s+/g, ' ');
  o.msgs = t.match(/.{0,80}(already|exist|registered|in use|valid)[^.]{0,80}/ig) || [];
  o.formText = t.slice(t.indexOf('Preferences') + 11, t.indexOf('Desktop Notification')).slice(0, 1500);
  await page.screenshot({ path: R + 'zoho-B3-3-existing-email-typed.png' });
  return o; })
