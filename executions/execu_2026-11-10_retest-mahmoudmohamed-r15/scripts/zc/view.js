// open Leads and switch to a view by name
module.exports = async (page, name) => {
  await require('./nav.js').leads(page); await page.waitForTimeout(2000);
  let v = page.getByText(name, { exact: true }).locator('visible=true');
  if (!(await v.count())) { await page.mouse.click(537, 70); await page.waitForTimeout(2500);
    const s = page.locator('input[placeholder*="Search" i]').locator('visible=true'); if (await s.count()) { await s.last().fill(name.slice(0, 14)); await page.waitForTimeout(2000); }
    v = page.getByText(name, { exact: true }).locator('visible=true'); }
  await v.first().click(); for (let i=0;i<30;i++){ await page.waitForTimeout(1500); const t=await page.innerText('body').catch(()=>''); if (new RegExp(name.replace(/ /g,'\s+')).test(t) && /Total Records/.test(t)) break; }
  await page.waitForTimeout(3000);
};
