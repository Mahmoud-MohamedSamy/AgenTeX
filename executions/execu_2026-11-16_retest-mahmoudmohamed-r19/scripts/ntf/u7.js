await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); if (await page.getByRole('button',{name:/^Notifications/}).count()) break; }
await sleep(2000);await page.getByRole('button',{name:/^Notifications/}).first().click();for(let k=0;k<30;k++){await sleep(2000);if(/QA RT19 NTF 3061/.test(await text()))break;}await sleep(1500);
const t=(await text()).replace(/\s+/g,' ');const i=t.indexOf('QA RT19 NTF 3061');
await shot('3061-1-samy-bell.png');
return t.slice(Math.max(0,i-300),i+300);
