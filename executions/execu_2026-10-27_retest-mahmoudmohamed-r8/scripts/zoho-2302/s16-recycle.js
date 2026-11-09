// Recycle Bin: permanently delete ONLY the three QA RT 2302 leads (by record id).
const IDS = ['7654005000000790018', '7654005000000789018', '7654005000000784031'];
module.exports = async ({ page, shot, log, gotoReady, args }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/recyclebin', /Recycle Bin/);
  await page.waitForTimeout(4000);
  for (const id of IDS) { const c = page.locator(`input[data-zcqa="rclChk"][value="${id}$Leads"]`); if (await c.count()) await c.locator('xpath=..').click(); await page.waitForTimeout(400); }
  const checked = await page.locator('input[data-zcqa="rclChk"]:checked').evaluateAll(es => es.map(e => e.value));
  log('CHECKED', checked);
  if (checked.length !== 3 || !checked.every(v => IDS.includes(v.split('$')[0]))) { log('selection mismatch - abort'); return; }
  await shot('recycle-selected');
  log('BUTTONS', await page.locator('button:visible, input[type=button]:visible, lyte-button:visible, a.btn:visible').evaluateAll(es => es.map(e => (e.innerText || e.value || '').trim()).filter(Boolean)));
  if (args[0] !== 'purge') return;
  await page.locator('button:visible, input[type=button]:visible, lyte-button:visible').filter({ hasText: /^\s*Delete\s*$/ }).first().click().catch(async () => { await page.locator('input[type=button][value="Delete"]:visible').first().click(); });
  await page.waitForTimeout(2500); await shot('recycle-confirm');
  log('CONFIRM BTNS', await page.locator('button:visible, input[type=button]:visible, lyte-button:visible').evaluateAll(es => es.map(e => (e.innerText || e.value || '').trim()).filter(Boolean)));
  if (args[1] !== 'confirm') return;
  await page.mouse.click(1063, 239); await page.waitForTimeout(6000);
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/recyclebin', /Recycle Bin/); await page.waitForTimeout(3000);
  await shot('recycle-after');
  const t = (await page.innerText('body')).replace(/s+/g, ' ');
  log('AFTER has QA RT 2302:', /QA RT 2302/.test(t), '|', t.slice(t.indexOf('Displaying'), t.indexOf('Displaying') + 60));
};
