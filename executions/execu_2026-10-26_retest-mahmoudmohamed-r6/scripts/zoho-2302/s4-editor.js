// Blueprint editor: drop two states (lands as -None- -> Acquired), define the transition, optionally publish.
const drag = async (page, x1, y1, x2, y2) => { await page.mouse.move(x1, y1); await page.mouse.down(); for (let i = 1; i <= 15; i++) { await page.mouse.move(x1 + (x2 - x1) * i / 15, y1 + (y2 - y1) * i / 15); await page.waitForTimeout(40); } await page.mouse.up(); await page.waitForTimeout(1500); };
module.exports = async ({ page, shot, log, args }) => {
  await drag(page, 1191, 459, 350, 300);
  await drag(page, 1199, 426, 750, 300);
  await shot('bp-ed-states');
  await page.mouse.click(560, 170); await page.waitForTimeout(2500);
  await shot('bp-ed-transition');
  log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 1500));
  if (args[2] === 'tr') await require('./s5-transition.js')({ page, shot, log, args });
};
