await sleep(10000);
const head = (await txt()).match(/Layout Builder[^\n]*\n[^\n]*|Leads\n\|\n[^\n]*/)?.[0];
const onLayout = await page.locator('main').getByText('QA RT rollup', { exact: true }).count();
await shot('1444-09-reloaded-wait');
return done({ head, onLayout, t: (await txt()).split('Meetings')[1]?.slice(0, 300) });
