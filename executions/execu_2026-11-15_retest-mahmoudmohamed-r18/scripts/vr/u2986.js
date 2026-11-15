const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(8000);
R.url = page.url().replace(H, ''); R.signedOut = (await page.getByText('Forgot password?').count()) > 0;
const t = (await text()).replace(/\s+/g, ' '); R.body = t.slice(0, 1500); R.qaRows = (t.match(/QA RT18[^|]{0,40}/g) || []).slice(0, 10);
R.rows = (await page.locator('tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 140)).slice(0, 12);
await shot('2986-1-u1-rule-list.png');
await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' }); await sleep(6000); R.settingsBody = (await text()).replace(/\s+/g, ' ').slice(0, 600); await shot('2986-2-u1-settings.png');
return R;
