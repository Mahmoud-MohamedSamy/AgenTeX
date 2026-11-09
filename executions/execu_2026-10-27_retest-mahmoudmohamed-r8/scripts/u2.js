// Expand Owner in the filter panel and read every option.
const panel = page.locator('text=Filter Leads by').locator('xpath=ancestor::*[self::aside or self::div][.//text()[.="FIELDS"]][1]');
await page.getByText('Owner', { exact: true }).first().click({ force: true }); await sleep(2500);
const opts = new Set(); for (let i = 0; i < 12; i++) { (await page.locator('label, [role=option], [role=checkbox]').allInnerTexts()).forEach(x => x.trim() && opts.add(x.trim().replace(/\s+/g, ' '))); await page.mouse.move(150, 500); await page.mouse.wheel(0, 250); await sleep(300); }
await page.getByText('Owner', { exact: true }).first().scrollIntoViewIfNeeded(); await sleep(500); await shot('2281-02-owner-options');
const t = (await txt()).split('\n').filter(l => l.trim()); const k = t.findIndex(l => l === 'Owner');
return done({ around: t.slice(k, k + 30), opts: [...opts].slice(0, 60) });
