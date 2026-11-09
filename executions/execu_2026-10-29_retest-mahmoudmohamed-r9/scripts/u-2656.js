// NDC-2656 (screen, owner): Settings › Users → search own email → row menu → profile change → pick "User". Look at Assign + any warning. Assign is NEVER clicked.
const ME = 'anyware-staging-owner@anyware.software';
await page.goto(H + '/settings/general/users', { waitUntil: 'domcontentloaded', timeout: 150000 });
await page.waitForSelector('input[placeholder^="Search by email"]', { timeout: 120000 }); await sleep(2000);
await page.fill('input[placeholder^="Search by email"]', ME); await sleep(4000);
const row = page.locator('tr', { hasText: ME }).first(); await row.waitFor({ timeout: 60000 });
await row.locator('button').last().click(); await sleep(1500); await shot('2656-1-menu.png');
const out = { menu: (await page.$$eval('[role=menuitem], [role=menu] button', els => els.map(e => e.innerText.trim()).filter(Boolean))).slice(0, 12) };
const item = await page.$('[role=menuitem]:has-text("profile"), [role=menu] button:has-text("rofile")');
if (item) { await item.click(); await sleep(3000); } else { await page.keyboard.press('Escape'); await row.click(); await sleep(4000); }
await shot('2656-2-panel.png');
// pick the lower profile "User" in the profile control, without assigning
const sel = await page.$('select');
if (sel) { const opts = await sel.$$eval('option', o => o.map(x => x.textContent.trim())); out.options = opts.slice(0, 15); const u = opts.find(o => /^User\b/.test(o)); if (u) await sel.selectOption({ label: u }); }
else { const cb = await page.$('[role=combobox]'); if (cb) { await cb.click(); await sleep(1500); const o = page.locator('[role=option]', { hasText: /^User/ }).first(); if (await o.count()) await o.click(); } }
await sleep(2000); await shot('2656-3-picked-user.png');
const t = await text(); const assign = await page.$('button:has-text("Assign")');
out.assignEnabled = assign ? !(await assign.isDisabled()) : 'no Assign button';
out.warning = (t.match(/.{0,80}(warning|lose|owner rights|can't be undone|cannot be undone|your own|yourself|downgrad|demot).{0,200}/i) || [''])[0].replace(/\s+/g, ' ');
out.dialogText = t.slice(Math.max(0, t.search(/Assign/) - 400), t.search(/Assign/) + 60).replace(/\s+/g, ' ');
await page.keyboard.press('Escape'); return out;
