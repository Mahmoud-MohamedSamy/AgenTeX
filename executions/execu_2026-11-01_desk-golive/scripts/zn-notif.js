async (page) => { const o = {};
  const n = page.getByText('Notifications', { exact: true }).first(); o.c = await n.count(); await n.click({ timeout: 8000 }).catch(e => o.e = e.message.slice(0, 50)); await page.waitForTimeout(2000);
  o.sub = await page.evaluate(() => [...new Set([...document.querySelectorAll('a, li, span, div')].filter(e => e.offsetParent && e.children.length === 0 && e.textContent.trim().length < 35).map(e => e.textContent.trim()))].filter(t => /Notif|Alert|Agent|Team|Customer/i.test(t)).slice(0, 20));
  return o; }
