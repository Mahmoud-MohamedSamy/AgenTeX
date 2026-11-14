await go('/team-feeds/' + MK + '/all', 10000);
await page.getByText(/^Share an update with Marketing/).first().click(); await sleep(2000);
const ed = page.locator('[contenteditable=true][aria-label=Post]').first(); await ed.click();
await page.keyboard.type('QA GL W5 feed post for ', { delay: 20 }); await page.keyboard.type('@mah', { delay: 120 }); await sleep(3000);
out.sugg = (await page.locator('[role=listbox], [role=option], [data-mention], .mention-list, [class*=suggest]').allInnerTexts().catch(() => [])).slice(0, 8);
await shot('w5/W5-32-mention');
const opt = page.locator('[role=option]').filter({ hasText: 'mahmoud.mahamed1515@gmail.com' }).first(); if (await opt.count()) { out.picked = await opt.innerText(); await opt.click(); await sleep(800); }
await page.keyboard.type(' please check', { delay: 20 });
const area = page.locator('body');


out.text = await ed.innerHTML();
const n0 = NET.length; await page.getByRole('button', { name: 'Post to Marketing' }).click().catch(e => out.postErr = e.message.slice(0, 80)); await sleep(4000);
out.post = NET.slice(n0).filter(x => /feed/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.b.slice(0, 300) + ' => ' + x.t.slice(0, 200));
const m = out.post.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) CREATED.push({ kind: 'feed', id: m[1], name: 'QA GL W5 feed post' });
await shot('w5/W5-32-posted');
return fin({ out });
