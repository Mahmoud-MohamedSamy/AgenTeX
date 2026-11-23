await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
const wf = page.getByText('Workflows', { exact: true }); await wf.first().waitFor({ timeout: 120000 }); await sleep(3000);
const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await wf.first().click(); await sleep(5000);
let fr = null; for (let k = 0; k < 20 && !fr; k++) { await sleep(3000); const f = page.frames().find(f => /ShowHomePage/.test(f.url())); if (f && /Rule|rule/.test(await body(f))) fr = f; }
out.list = fr ? (await body(fr)).slice(0, 900) : 'no frame text';
await shot('3-rules');
const rulesItem = page.getByText('Rules', { exact: true }).first(); const box = await rulesItem.boundingBox(); out.box = box;
await page.mouse.click(181, box.y + box.height / 2); await sleep(20000); await shot('4-new-rule');
const fr2 = page.frames().find(f => /ShowHomePage/.test(f.url())); out.newRule = fr2 ? (await body(fr2)).slice(0, 1500) : 'no frame';
