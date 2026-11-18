await page.mouse.click(1427, 73); await page.waitForTimeout(7000);
const all = async () => { const t = []; for (const f of page.frames()) t.push(await f.innerText('body').catch(() => '')); return t.join(' ').replace(/\s+/g, ' '); };
out.t = (await all()).match(/.{0,80}Role and Permission.{0,700}/)?.[0];
for (const f of page.frames()) { const l = f.getByText(/Role and Permission/).first(); if (await l.count()) { await l.scrollIntoViewIfNeeded().catch(() => {}); break; } }
await page.waitForTimeout(800); await shotZ(page, 'ac2-newagent-role');
