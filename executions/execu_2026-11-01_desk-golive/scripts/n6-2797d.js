const o = {};
await page.getByText('Use only the statuses picked below', { exact: true }).click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
await page.mouse.wheel(0, 500); await sleep(1000);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Use only the statuses picked below'); o.sec = t.slice(i, i + 900);
o.shot = await shot('rt/2797-pick');
return JSON.stringify(o);
