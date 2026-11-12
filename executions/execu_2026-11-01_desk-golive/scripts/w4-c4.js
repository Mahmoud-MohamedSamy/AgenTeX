const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 150) + ' => ' + x.t.slice(0, 200));
const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const TID = '604d7a0c-6e28-44cc-af76-9d68b1576888';
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
await p.goto(HOME + 'community', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.getByRole('link', { name: /^New topic/ }).first().click().catch(() => p.getByRole('button', { name: /^New topic/ }).first().click()); await p.waitForTimeout(5000);
out.signedOut = p.url().replace(/hc1\.[\w.-]+/, 'HC') + ' :: ' + (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 200);
await ctx.close();
await go('/community', 10000);
await page.getByText('QA GL W4 agent topic').first().click(); await sleep(5000);
out.topicUrl = page.url().replace(H, '');
out.actions = (await page.locator('main button, main [role=menuitem]').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 30);
const more = page.getByRole('button', { name: /More|Actions|options/i }).first(); if (await more.count()) { await more.click(); await sleep(1200); out.menu = await page.locator('[role=menuitem]').allInnerTexts(); }
const conv = page.getByRole('menuitem', { name: /ticket/i }).first(); const n0 = NET.length;
if (await conv.count()) { await conv.click(); await sleep(3000); const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.convDlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 400); await d.getByRole('button', { name: /^(Convert|Create)/ }).last().click().catch(() => {}); await sleep(4000); } }
out.convNet = nn(n0);
await shot('w4/W4-58-topic');
return fin({ out });
