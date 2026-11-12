const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h; const main = page.locator('main').last(); const clk = l => l.dispatchEvent('click');
  const nets = []; page.on('response', async r => { if (/roles|org-units|orgunits/i.test(r.url())) nets.push(r.status() + ' ' + r.url().split('/api/v1')[1]?.slice(0, 80)); });
  await openEditor(h, 'QA AO WF E2E1 ui', 'Create');
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  log('actionMenu', (await main.innerText()).split('\n').filter(l => /owner|assign/i.test(l)).slice(0, 6));
  await clk(main.getByRole('button', { name: /Owner Assignment|Assign owner|Owner/ }).first()); await page.waitForTimeout(1000);
  const txt = (await main.innerText()).split('\n').filter(l => /role|round|user|team|online/i.test(l)); log('ownerPanel', txt.slice(0, 15));
  const rr = main.getByText(/round robin/i).first(); if (await rr.count()) { await rr.click({ force: true }); await page.waitForTimeout(800); }
  const btns = await main.locator('button').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || '') + '|' + x.innerText.trim().slice(0, 30)).filter(t => /role|select|pick/i.test(t))); log('buttons', btns.slice(0, 10));
  const pick = main.locator('button', { hasText: /Select a role|Pick a role|Select role|role/i }).first(); if (await pick.count()) { await pick.dispatchEvent('click'); await page.waitForTimeout(900); log('roleOptions', (await page.getByRole('option').allInnerTexts()).slice(0, 30)); }
  log('nets', nets); await shot('e2e1-owner-role');
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
};
