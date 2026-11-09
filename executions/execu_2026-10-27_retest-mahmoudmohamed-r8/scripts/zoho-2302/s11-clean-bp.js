// Cleanup: delete blueprint "QA RT 2302 BP" (only that row). Usage: node run.js s11-clean-bp.js [confirm]
module.exports = async ({ page, shot, log, gotoReady, args }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/blueprint', /QA RT 2302 BP|Lead nurturing process/);
  const row = page.locator('tr[data-zcqa="wfentity"]').filter({ hasText: 'QA RT 2302 BP' });
  if (await row.count() !== 1) { log('row count', await row.count()); return; }
  await row.hover(); await row.locator('[data-zcqa="blueprint_moreIcon"]').hover(); await page.waitForTimeout(1200);
  await row.locator('#lnk_wf_del').click(); await page.waitForTimeout(2500);
  await shot('bp-delete-confirm');
  const btns = await page.locator('button:visible, lyte-button:visible, input[type=button]:visible').evaluateAll(es => es.map(e => (e.innerText || e.value || '').trim()).filter(Boolean));
  log('BUTTONS', btns.join(' | '));
  log('TEXT', (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,300}(delete|Delete).{0,300}/g)?.slice(-2).join(' ## '));
  if (args[0] !== 'confirm') return;
  await page.getByText('I understand that the Blueprint cannot be recovered.').locator('visible=true').first().click(); await page.waitForTimeout(800);
  const b = page.locator('button:visible, lyte-button:visible, input[type=button]:visible').filter({ hasText: /^\s*(Delete|Yes|OK|Proceed)\s*$/ });
  log('confirm buttons', await b.count()); await b.last().click(); await page.waitForTimeout(5000);
  await shot('bp-deleted');
  const body = (await page.innerText('body')).replace(/\s+/g, ' ');
  log('LIST', body.slice(body.lastIndexOf('All Status'), body.lastIndexOf('All Status') + 400));
};
