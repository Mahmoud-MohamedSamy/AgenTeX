await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
const wf = page.getByText('Workflows', { exact: true }); await wf.first().waitFor({ timeout: 120000 }); await sleep(3000);
const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await wf.first().click(); await sleep(5000);
let fr = null; for (let k = 0; k < 20 && !fr; k++) { await sleep(3000); const f = page.frames().find(f => /ShowHomePage/.test(f.url())); if (f && /Rule|rule/.test(await body(f))) fr = f; }
out.list = fr ? (await body(fr)).slice(0, 900) : 'no frame text';
await shot('3-rules');
const rulesItem = page.getByText('Rules', { exact: true }).first(); const box = await rulesItem.boundingBox(); out.box = box;
await page.mouse.click(181, box.y + box.height / 2); await sleep(20000); await shot('4-new-rule');
const F = () => page.frames().find(f => /ShowHomePage/.test(f.url()));
await page.mouse.click(497, 325); await page.keyboard.type('QA tmp owner check'); await sleep(800);
await page.mouse.click(324, 842); await sleep(6000); await shot('5-step2'); out.step2 = (await body(F())).replace(/^.*Sign Out /, '').slice(0, 900);
await page.mouse.click(333, 168); await sleep(800); await page.mouse.click(324, 842); await sleep(6000); await shot('6-step3'); out.step3 = (await body(F())).replace(/^.*Happiness Rating Execute the rule on receiving ratings from customers\. /, '').slice(0, 700);
await page.mouse.click(324, 842); await sleep(6000); await shot('7-step4'); out.step4 = (await body(F())).replace(/^.*?3 Criteria/, '3 Criteria').slice(0, 900);
{ const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {}); await sleep(800); }
await page.mouse.click(1297, 526); await sleep(2500); await shot('8-action-menu'); out.menu = (await body(F())).replace(/^.*?All Actions/, 'All Actions').slice(0, 700);
await F().getByText('Assign Ticket', { exact: true }).first().click(); await sleep(3000); await shot('9-assign-ticket'); out.assign1 = (await body(F())).replace(/^.*?All Actions/, 'All Actions').slice(0, 900);
