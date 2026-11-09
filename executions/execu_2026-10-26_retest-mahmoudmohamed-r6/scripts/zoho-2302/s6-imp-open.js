// Open Leads > Create Lead (arrow) > Import Leads, upload CSV, show the next step.
const path = require('path');
module.exports = async ({ page, shot, log, gotoReady, args }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads', /Create Lead/);
  await page.mouse.click(1510, 115); await page.waitForTimeout(1500);
  await page.locator('[data-zcqa="cv_importParent"]').first().click();
  for (let s = 0; s < 40; s++) { await page.waitForTimeout(1000); if (/Drag and drop your file/.test(await page.innerText('body'))) break; }
  log(page.url());
  await shot('imp-step1');
  log('INPUTS', await page.locator('input[type=file]').count());
  await page.locator('input[type=file]').first().setInputFiles(path.join(__dirname, 'csv', `qa-rt-2302-${args[0] || 'off'}.csv`));
  await page.waitForTimeout(6000);
  await shot('imp-step1-uploaded');
  log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 2000));
  for (let n = 2; n <= 4; n++) {
    const next = page.getByText('Next', { exact: true }).locator('visible=true');
    if (!(await next.count())) { log('no Next on step', n); break; }
    await next.last().click(); await page.waitForTimeout(6000);
    await shot('imp-step' + n);
    log('STEP' + n, page.url().split('/').pop(), (await page.innerText('body')).replace(/s+/g, ' ').replace(/^.*?Assign Help/, '').slice(0, 1500));
  }
  await page.getByText('Save and Next', { exact: true }).locator('visible=true').last().click(); await page.waitForTimeout(6000);
  await shot('imp-' + (args[0] || 'off') + '-assign');
  log('STEP5', page.url().split('/').pop(), (await page.innerText('body')).replace(/s+/g, ' ').replace(/^.*?Assign Help/, '').slice(0, 2500));
  log('CHECKBOXES', await page.locator('input[type=checkbox], lyte-checkbox').evaluateAll(es => es.map(e => (e.tagName + ' checked=' + (e.checked ?? e.getAttribute('lt-prop-checked')) + ' vis=' + !!e.offsetParent + ' label=' + (e.closest('lyte-checkbox,label,div')||e).innerText.replace(/s+/g,' ').slice(0,200)))));
  if (args[1] === 'submit') await require('./s7-imp-submit.js')({ page, shot, log, args });
};
