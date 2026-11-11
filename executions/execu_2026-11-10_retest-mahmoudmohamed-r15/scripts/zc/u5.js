const fs=require('fs');
module.exports = async ({ page, api, log, shot, RUN }) => {
  const S=JSON.parse(fs.readFileSync(RUN+'/out/zoho-2806.json'));
  await require('./nav.js')(page);
  await page.getByText('QA RT15 GS Colors',{exact:true}).locator('visible=true').first().click(); await page.waitForTimeout(5000);
  await page.mouse.move(750, 288); await page.waitForTimeout(1000); await page.mouse.click(971, 288); await page.waitForTimeout(3000);
  await page.getByRole('button',{name:'Save'}).locator('visible=true').last().click(); await page.waitForTimeout(6000);
  await shot('c-2806-after-replace'); log('after', (await page.innerText('body')).replace(/\s+/g,' ').slice(-500));
  const sv = page.getByRole('button',{name:'Save'}).locator('visible=true'); if (await sv.count()) { await sv.last().click(); await page.waitForTimeout(5000); }
  await page.waitForTimeout(15000);
  const l = await api('GET', `/crm/v8/Leads/${S.lead}?fields=Last_Name,${S.api}`); log('lead', l.body.slice(0,200));
  const v = await api('GET', `/crm/v8/settings/custom_views/${S.cv}?module=Leads`); log('view', v.status, JSON.stringify(JSON.parse(v.body).custom_views?.[0]?.criteria));
  const g = await api('GET', '/crm/v8/settings/global_picklists/'+S.gs); const gj=JSON.parse(g.body).global_picklists[0]; log('gs', (gj.pick_list_values||[]).map(x=>x.display_value+(x.type?':'+x.type:'')).join(','), 'unused', JSON.stringify(gj.pick_list_values_unused||gj.unused_values||'').slice(0,200));
};
