const out = {}; await page.setViewportSize({ width: 1600, height: 900 }); await go('/settings', 6000); for (let j = 0; j < 60 && !(await txt()).includes('Audit Log'); j++) await sleep(2000);
await page.getByText('Audit Log', { exact: true }).first().click(); for (let j = 0; j < 40 && !/All Entities|Entities/.test(await txt()); j++) await sleep(2000); await sleep(3000);
await page.getByText(/All Entities/).first().click(); await sleep(2500); await shot('v39-entities');
let opts = (await page.locator('[role=option],[role=menuitemcheckbox],[role=menuitem]').allInnerTexts()).map(s => s.trim()).filter(Boolean);
if (opts.length < 5) opts = (await txt()).split('\n').map(l => l.trim()).filter(Boolean);
out.n = opts.length; out.suspicious = opts.filter(o => /^[a-z0-9_.]+$|row$|pin$|23c1a6|^Test$|qa_|audit\.entity/i.test(o)); out.all = opts.slice(0, 90);
return done(out);
