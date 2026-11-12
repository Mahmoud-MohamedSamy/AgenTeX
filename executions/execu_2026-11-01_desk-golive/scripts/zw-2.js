async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  await page.locator('text=/^QA SK12 A7$/').first().click().catch(e => o.e1 = e.message.slice(0, 80)); await sleep(9000);
  o.url = page.url(); o.head = (await flat()).match(/QA SK12 A7.{0,400}/)?.[0];
  await page.screenshot({ path: S + 'z-ticket.png' });
  o.buttons = await page.$$eval('button, [role=button]', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => (b.innerText || b.getAttribute('aria-label') || b.getAttribute('data-title') || '').trim()).filter(Boolean))].slice(0, 60));
  o.titles = await page.$$eval('[data-title]', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.getAttribute('data-title')))].slice(0, 60));
  return o; }
