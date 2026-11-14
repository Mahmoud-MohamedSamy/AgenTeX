await go('/team-feeds/' + MK + '/all', 10000);
out.head = (await mtxt()).slice(0, 300);
const box = page.getByText(/^Share an update with Marketing/).first(); out.box = await box.count();
await box.click(); await sleep(1000);
const ed = page.locator('[contenteditable=true], textarea').first();
await page.keyboard.type('QA GL W5 feed post for ', { delay: 20 }); await page.keyboard.type('@mahmoud', { delay: 80 }); await sleep(2500);
out.sugg = (await page.locator('[role=listbox], [role=menu], [role=option]').allInnerTexts().catch(() => [])).slice(0, 8);
await shot('w5/W5-32-mention');
const opt = page.getByRole('option').first(); if (await opt.count()) { await opt.click(); await sleep(800); } else { await page.keyboard.press('Enter'); }
await page.keyboard.type(' please check', { delay: 20 });
out.btns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean));
const n0 = NET.length; await page.getByRole('button', { name: /^(Post|Share|Publish)$/ }).first().click().catch(e => out.postErr = e.message.slice(0, 80)); await sleep(4000);
out.post = NET.slice(n0).filter(x => /feed/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.b.slice(0, 300) + ' => ' + x.t.slice(0, 200));
const m = out.post.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) CREATED.push({ kind: 'feed', id: m[1], name: 'QA GL W5 feed post' });
out.after = (await mtxt()).slice(0, 500); await shot('w5/W5-32-posted');
return fin({ out });
