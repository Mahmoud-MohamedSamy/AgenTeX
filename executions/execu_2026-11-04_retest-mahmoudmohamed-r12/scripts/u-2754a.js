// open the blueprint designer of "QA RT12 2774 bp" and collect the JS chunks it loads (to read the definition keys of the new features)
const js = new Set(); page.on('response', r => { if (/assets\/.*\.js$/.test(r.url())) js.add(r.url()); });
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Blueprints/.test(await text())) break; }
await page.goto(H + '/settings/automation/blueprints?department=b8941829-5e08-43e1-b8e0-89c33bb9903c', { waitUntil: 'commit', timeout: 120000 }); await sleep(12000);
await page.getByText('QA RT12 2774 bp').first().click().catch(() => {}); await sleep(12000);
await shot('2754-a-designer.png');
await page.getByText('Open', { exact: true }).first().click().catch(() => {}); await sleep(3000);
require('fs').writeFileSync('../2754-chunks.txt', [...js].join('\n'));
return { url: page.url(), n: js.size, t: (await text()).slice(0, 600) };
