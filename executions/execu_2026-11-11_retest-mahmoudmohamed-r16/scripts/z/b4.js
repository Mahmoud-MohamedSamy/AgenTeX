async (page) => { await page.getByText('Not Now', { exact: true }).first().click().catch(()=>{}); await page.waitForTimeout(1500);
 await page.locator('text=ACTIVITY').first().click({ timeout: 15000 }); await page.waitForTimeout(5000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-activity-tab-empty.png'});
 const t = await page.innerText('body'); const i = t.indexOf('ACTIVITY'); return t.slice(i, i + 700); }
