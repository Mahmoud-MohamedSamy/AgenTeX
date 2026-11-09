(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  await page.getByText('Agents', { exact: true }).first().click().catch(e => o.e1 = e.message.slice(0, 80));
  await page.waitForTimeout(15000);
  const t = (await page.innerText('body')).replace(/\s+/g, ' '); const i = t.lastIndexOf('Need Help'); const j = t.indexOf('PERSONALIZATION');
  o.url = page.url(); o.content = t.slice(t.indexOf('Preferences', j) + 11, t.indexOf('Desktop Notification')).slice(0, 1200);
  o.btns = await page.$$eval('button, a, [role=button]', bs => bs.filter(b => b.offsetParent && b.getBoundingClientRect().left > 250).map(b => (b.innerText || b.getAttribute('aria-label') || b.title || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean).slice(0, 40));
  await page.screenshot({ path: R + 'zoho-B3-1-agents.png' });
  return o; })
