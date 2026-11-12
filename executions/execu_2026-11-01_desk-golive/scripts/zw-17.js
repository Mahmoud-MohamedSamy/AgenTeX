async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.getByText('Cancel', { exact: true }).first().click().catch(() => {}); await sleep(1500);
  await page.locator('[data-title="My Information (U)"]').first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(3000);
  o.menu = (await page.innerText('body')).replace(/\s+/g, ' ').match(/(My Profile|Personal|Preferences|Signature).{0,300}/)?.[0];
  o.links = await page.$$eval('a, li, span', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(t => /signature|personal|preference|profile|setting/i.test(t) && t.length < 40))].slice(0, 15));
  await page.screenshot({ path: S + 'z-myinfo.png' }); return o; }
