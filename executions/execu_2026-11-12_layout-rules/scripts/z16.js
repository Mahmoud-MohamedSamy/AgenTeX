async (page) => {
  const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  const R = {};
  const faxVis = async () => page.evaluate(() => { const e = document.getElementById('Crm_Leads_FAX_objLyteCRUD1w151c1rj') || document.getElementById('Crm_Leads_FAX'); if (!e) return null; const r = e.getBoundingClientRect(); return r.height > 0; });
  const ind = async v => { await page.locator('#Crm_Leads_INDUSTRY').click(); await page.waitForTimeout(900); const o = page.getByText(v, { exact: true }); for (let i = (await o.count()) - 1; i >= 0; i--) if (await o.nth(i).isVisible()) { await o.nth(i).click(); break; } await page.waitForTimeout(1500); };
  R.faxStart = await faxVis();
  await ind('ASP (Application Service Provider)'); R.faxASP = await faxVis();
  await page.locator('#Crm_Leads_FAX_LInput').fill('QA zoho fax'); await page.waitForTimeout(500);
  await ind('ERP (Enterprise Resource Planning)'); R.faxERP = await faxVis();
  await page.locator('#Crm_Leads_LASTNAME_LInput').fill('QA LR1112 z E6'); await page.locator('#Crm_Leads_COMPANY_LInput, #Crm_Leads_COMPANY input').first().fill('QA LR1112');
  await page.screenshot({ path: EVd + 'zoho-E6-before-save.png' });
  const sv = page.getByRole('button', { name: 'Save', exact: true }); let clicked = false; for (let i = (await sv.count()) - 1; i >= 0; i--) if (await sv.nth(i).isVisible()) { await sv.nth(i).click(); clicked = true; break; }
  if (!clicked) { const s2 = page.getByText('Save', { exact: true }); for (let i = (await s2.count()) - 1; i >= 0; i--) if (await s2.nth(i).isVisible()) { await s2.nth(i).click(); break; } }
  await page.waitForTimeout(6000); R.url = page.url().replace(/\?.*/, '');
  const id = (R.url.match(/Leads\/(\d+)/) || [])[1]; R.id = id;
  if (id) { const g = await zf(page, 'GET', '/crm/v8/Leads/' + id + '?fields=Fax,Industry,Last_Name'); R.saved = g.t.slice(0, 300); }
  return R;
}
