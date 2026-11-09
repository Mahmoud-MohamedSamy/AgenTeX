const o = {};
await page.goto(H + '/settings/automation/workflow-rules/171841cb-fa2d-4895-9505-7fca222a720b', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1500); const t = await txt(); if (/Owner Assignment/.test(t)) break; }
await sleep(3000);
const n = page.locator('text=/loses its owner|team and an agent|agent in the team|Agent \(optional\)/').first(); await n.scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, 200); await sleep(1000);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Owner Assignment'); o.sec = t.slice(i, i + 900);
o.shot = await shot('rt/2794-owner-assignment');
const add = page.locator('button', { hasText: /^\s*Add action\s*$/ }).first(); if (await add.count()) { await add.click().catch(() => {}); await sleep(1500); }
o.actions = (await txt()).replace(/\s+/g, ' ').match(/Field Update Set fields.{0,900}/)?.[0]?.match(/(Owner Assignment|Field Update|Webhook|Email|Task|Create Record|Add Tags|Remove Tags|Share ticket|Reassign[a-z ]*)/g);
o.shot2 = await shot('rt/2794-add-action');
await page.keyboard.press('Escape');
return JSON.stringify(o);
