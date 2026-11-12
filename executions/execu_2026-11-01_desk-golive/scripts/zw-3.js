async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  await page.locator('[data-title="QA SK12 A7 QASK12RR"]').first().click().catch(e => o.e1 = e.message.slice(0, 80)); await sleep(10000);
  o.url = page.url(); await page.screenshot({ path: S + 'z-ticket.png' });
  o.titles = await page.$$eval('[data-title]', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.getAttribute('data-title')))].filter(t => !/record|QA SK12|#1\d\d|Created on/.test(t)).slice(0, 80));
  return o; }
