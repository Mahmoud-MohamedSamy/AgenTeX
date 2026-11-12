async (page) => { const R = {}; const resp = []; const h = r => { if (/validation-rules/.test(r.url())) resp.push(r.request().method() + ' ' + r.status()); }; page.on('response', h);
  await page.goto(HOST + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(10000);
  R.url = page.url(); R.text = (await bodyText()).replace(/.*?(Validation Rules|No access|permission|not allowed|403)/i, '$1').slice(0, 400);
  R.newRule = await page.getByRole('button', { name: /new rule/i }).count(); R.switches = await page.getByRole('switch').count(); R.api = resp;
  await page.screenshot({ path: EV + 'desk-A3-agent.png' }); page.off('response', h); return R; }
