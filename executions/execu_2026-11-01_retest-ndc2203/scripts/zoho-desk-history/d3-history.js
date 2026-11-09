// READ-ONLY: open ticket, dismiss the notification popup (x), open the History (clock) panel, capture.
module.exports = async ({ page, log, shot, args }) => {
  const subj = args[0] || 'test ticket from mail'; const tag = args[1] || '101';
  await page.goto('https://desk.zoho.com/agent/taviportal/anyware-software/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let s = 0; s < 45; s++) { await page.waitForTimeout(1000); if ((await page.innerText('body').catch(() => '')).includes(subj)) break; }
  await page.getByText(subj, { exact: true }).first().click();
  await page.waitForTimeout(8000);
  await page.mouse.click(1225, 95).catch(() => {}); await page.waitForTimeout(800);
  await page.mouse.move(312, 157); await page.waitForTimeout(800);
  log('rail tooltip', (await page.innerText('body')).match(/(History|Timeline|Activity)[^\n]{0,30}/g)?.slice(0, 5));
  await page.mouse.click(312, 157); await page.waitForTimeout(5000);
  await shot(`t${tag}-panel`);
  const t = await page.innerText('body');
  const i = t.search(/History/); log('TEXT', t.slice(Math.max(0, i - 100), i + 2500).replace(/\n+/g, ' / '));
  log('DEPT nodes', await page.getByText(/Department|department/).evaluateAll(es => es.filter(e => e.offsetParent && e.childElementCount < 3).map(e => { const r = e.getBoundingClientRect(); return e.tagName + ' [' + [r.left, r.top, r.right, r.bottom].map(Math.round) + '] ' + e.innerText.replace(/\s+/g, ' ').slice(0, 150); })));
};
