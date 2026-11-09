// Create blueprint "QA RT 2302 BP" (Leads / Standard / Rating, criteria Last Name starts with "QA RT 2302").
// Usage: node run.js s3-create.js [op|fill|next] [editor] [publish]
module.exports = async ({ page, shot, log, gotoReady, args }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/blueprint', /Lead nurturing process/);
  const body = (await page.innerText('body')).replace(/\s+/g, ' ');
  log('LIST', body.slice(body.lastIndexOf('All Status'), body.lastIndexOf('All Status') + 400));
  if (/QA RT 2302 BP/.test(body)) { log('blueprint already exists - stop'); return; }
  await page.locator('text=/^\\s*Create Blueprint\\s*$/').last().click();
  await page.waitForTimeout(3000);
  await page.keyboard.type('QA RT 2302 BP');
  await page.getByText('-None-', { exact: true }).last().click();
  await page.waitForTimeout(1000);
  await page.getByText('Rating', { exact: true }).locator('visible=true').last().click();
  await page.waitForTimeout(1500);
  await page.mouse.click(505, 369); await page.waitForTimeout(1500);
  await page.keyboard.type('Last Name'); await page.waitForTimeout(1500);
  await page.mouse.click(505, 437); await page.waitForTimeout(1500);
  await page.mouse.click(640, 369); await page.waitForTimeout(1500);
  const vis = async (t) => page.getByText(t, { exact: true }).locator('visible=true').last();
  if (args[0] === 'op') return;
  await (await vis('starts with')).click(); await page.waitForTimeout(1000);
  await page.mouse.click(860, 372); await page.keyboard.type('QA RT 2302'); await page.waitForTimeout(800);
  await page.keyboard.press('Tab');
  await shot('bp-dialog-filled');
  if (args[0] !== 'next') return;
  await (await vis('Next')).click(); await page.waitForTimeout(8000);
  await shot('bp-editor');
  if (args[1] === 'editor') await require('./s4-editor.js')({ page, shot, log, args });
};
