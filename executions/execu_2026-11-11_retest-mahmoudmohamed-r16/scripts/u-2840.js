await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Ticket Owner/.test(await text()) && /Department/.test(await text())) break; } await sleep(3000);
await page.getByText('ndc-staging-owner').first().click(); await sleep(2500);
const t = await text(); const i = t.indexOf('Search users'); log('picker text:', t.slice(Math.max(0, i - 50), i + 900));
log('options:', (await page.locator('[role=option]').allInnerTexts()).map(x => x.split('\n')[0]));
log('tabs/btns:', await page.$$eval('[role=tab], [role=listbox] button, [role=dialog] button', bs => bs.map(b => b.innerText.trim()).filter(Boolean)));
await shot('2840-owner-picker.png');
