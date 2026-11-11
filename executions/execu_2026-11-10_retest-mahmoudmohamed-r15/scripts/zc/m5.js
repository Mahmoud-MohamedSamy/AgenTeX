const fs = require('fs');
module.exports = async ({ page, api, log, shot, RUN }) => {
  const S = JSON.parse(fs.readFileSync(RUN + '/out/zoho-2807.json'));
  const count = async (tag) => { const c = {}; for (let i = 0; i < S.ids.length; i += 100) { const r = await api('GET', `/crm/v8/Leads?ids=${S.ids.slice(i, i + 100).join(',')}&fields=Lead_Source`); for (const d of (JSON.parse(r.body).data || [])) c[d.Lead_Source] = (c[d.Lead_Source] || 0) + 1; } log(tag, JSON.stringify(c)); return c; };
  await require('./view.js')(page, 'QA RT15 2807 view');
  await count('before');
  await page.mouse.click(550, 171); await page.waitForTimeout(2500);
  await page.getByText('Select All records in this view').locator('visible=true').first().click(); await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Mass Update' }).locator('visible=true').first().click(); await page.waitForTimeout(4000);
  await page.getByText('Select a field').locator('visible=true').first().click(); await page.waitForTimeout(2000);
  await page.mouse.click(710, 140); await page.keyboard.type('Lead Source'); await page.waitForTimeout(1500);
  await page.getByText('Lead Source', { exact: true }).locator('visible=true').last().click(); await page.waitForTimeout(2500);
  await shot('c-2807-mu-field');
  await page.mouse.click(868, 96); await page.waitForTimeout(2000); await shot('c-2807-mu-values');
  const sv = page.locator('input[placeholder="Search"]').locator('visible=true'); if (await sv.count()) { await sv.last().fill('Cold Call'); await page.waitForTimeout(1500); }
  await page.getByText('Cold Call', { exact: true }).locator('visible=true').last().click(); await page.waitForTimeout(1500);
  await shot('c-2807-mu-ready');
  const t0 = Date.now();
  await page.getByRole('button', { name: 'Update' }).locator('visible=true').last().click();
  await page.waitForTimeout(1000); await shot('c-2807-mu-1s');
  log('page text at 1s', ((await page.innerText('body').catch(() => '')) || '').replace(/\s+/g, ' ').match(/.{0,120}(updat|progress|background|records).{0,160}/i)?.[0] || '-');
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Home/begin', { waitUntil: 'commit', timeout: 90000 }).catch(() => {});
  log('left page at ms', Date.now() - t0);
  await page.waitForTimeout(Math.max(0, 60000 - (Date.now() - t0))); await count('after 1 min');
  await page.waitForTimeout(Math.max(0, 180000 - (Date.now() - t0))); await count('after 3 min'); await shot('c-2807-home-3min');
  await require('./view.js')(page, 'QA RT15 2807 view'); await shot('c-2807-back');
};
