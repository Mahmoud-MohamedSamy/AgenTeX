async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded' }).catch(() => {}); await sleep(9000);
  await page.locator('[data-title="Add Ticket"]').first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(8000);
  o.url = page.url();
  o.labels = await page.$$eval('label, [class*=label]', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(t => t && t.length < 40))].slice(0, 40));
  o.inputs = await page.$$eval('input, textarea', es => es.filter(e => e.offsetParent !== null).map(e => [e.name || e.id || '', e.placeholder || '', e.getAttribute('data-id') || '']).slice(0, 30));
  await page.screenshot({ path: S + 'z-add-ticket.png' });
  return o; }
