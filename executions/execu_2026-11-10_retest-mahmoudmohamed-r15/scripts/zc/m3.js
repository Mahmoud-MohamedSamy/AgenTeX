module.exports = async ({ page, log, shot }) => {
  await require('./view.js')(page, 'QA RT15 2807 view'); await shot('c-2807-step1'); log('step1');
  await page.mouse.click(550,171); await page.waitForTimeout(2500); await shot('c-2807-selected');
  const T = async () => (await page.innerText('body')).replace(/\s+/g,' ');
  let t = await T(); log('sel', (t.match(/.{0,150}(selected|Select all).{0,200}/i)||[''])[0]);
  const all = page.getByText(/Select all 200|select all \d+ /i).locator('visible=true'); log('selall link', await all.count());
  if (await all.count()) { await all.first().click(); await page.waitForTimeout(2000); await shot('c-2807-selected-all'); t = await T(); log('sel2', (t.match(/.{0,150}selected.{0,200}/i)||[''])[0]); }
  const btns = await page.$$eval('button', bs => bs.filter(b=>b.offsetParent).map(b=>b.innerText.trim()).filter(Boolean)); log('buttons', btns.slice(0,30));
};
