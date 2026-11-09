// READ-ONLY: open ticket, open the tab overflow menu, choose History, capture.
module.exports = async ({ page, log, shot, args }) => {
  const subj = args[0] || 'test ticket from mail'; const tag = args[1] || '101';
  await page.goto('https://desk.zoho.com/agent/taviportal/anyware-software/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let s = 0; s < 45; s++) { await page.waitForTimeout(1000); if ((await page.innerText('body').catch(() => '')).includes(subj)) break; }
  await page.getByText(subj, { exact: true }).first().click();
  await page.waitForTimeout(8000);
  await page.mouse.click(1225, 95).catch(() => {}); await page.waitForTimeout(800);
  await page.mouse.click(1207, 156); await page.waitForTimeout(1500);
  await shot(`t${tag}-tabmenu`);
  const h = page.getByText(/^\s*History\s*$/i).locator('visible=true');
  log('history items', await h.count());
  await h.first().click(); await page.waitForTimeout(5000);
  await shot(`t${tag}`);
  const t = await page.innerText('body'); const i = t.search(/HISTORY/i);
  log('TEXT', t.slice(i, i + 3000).replace(/\n+/g, ' / '));
  log('DEPT nodes', await page.locator('body *').evaluateAll(es => es.filter(e => e.offsetParent && e.childElementCount === 0 && /Department|Anyware Software|MS HQ/i.test(e.textContent) ).map(e => { const r = e.getBoundingClientRect(); return e.tagName + ' [' + [r.left, r.top, r.right, r.bottom].map(Math.round) + '] ' + e.textContent.replace(/\s+/g, ' ').slice(0, 150); })));
};
