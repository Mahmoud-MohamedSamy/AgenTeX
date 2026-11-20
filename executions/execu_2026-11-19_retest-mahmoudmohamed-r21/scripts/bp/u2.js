const out = {};
await page.goto(H + '/settings/automation/blueprints/f2b2c1f5-56fd-4098-91e8-8a8704f78898', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA onlyA/.test(await text())) break; }
await page.getByText('QA onlyA', { exact: true }).first().click(); await sleep(3000);
let t = (await text()).replace(/\s+/g, ' '); let i = t.search(/Transition Owners|TRANSITION OWNERS|Owners/); out.owners = t.slice(i, i + 400);
await shot('3065-6-designer-readonly-owner.png');
// open owner picker
const add = page.getByRole('button', { name: /Add owner|Add owners|Choose|Select owners|Add/i }).filter({ hasText: /owner/i }).first(); out.add = await add.count();
if (out.add) { await add.click(); await sleep(2000); t = (await text()).replace(/\s+/g, ' '); out.picker = (t.match(/Customer Experience Specialists 2[^|]{0,40}/g) || []).slice(0, 4); await shot('3065-7-designer-owner-picker.png'); }
return out;
