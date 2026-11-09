// Name the transition, save it, then optionally publish the blueprint.
module.exports = async ({ page, shot, log, args }) => {
  await page.mouse.click(1380, 170); await page.keyboard.type('QA RT 2302 Go'); await page.waitForTimeout(500);
  await page.getByText('Save', { exact: true }).locator('visible=true').last().click(); await page.waitForTimeout(3000);
  await shot('bp-ed-tr-saved');
  log('AFTER SAVE', (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 1200));
  if (args[3] !== 'publish') return;
  await page.getByText('Publish', { exact: true }).locator('visible=true').last().click(); await page.waitForTimeout(5000);
  await shot('bp-publish-1');
  log('AFTER PUBLISH', (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 1500));
};
