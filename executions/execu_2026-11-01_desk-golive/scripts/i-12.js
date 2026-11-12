const o = {}; const U = 'e4c207d8-cda7-43a1-946d-4d2626759b7e', EM = '9804a4f1-b4d3-4b76-8638-3837001ceedc';
await page.goto(H + '/views/all/tickets/' + U, { waitUntil: 'commit' }).catch(() => {}); await sleep(12000);
await page.mouse.click(1249, 117); await sleep(2500); o.menu = (await page.locator('[role=menuitem]').allInnerTexts().catch(() => [])).join(' | ');
o.shotArchive = await shot('../wave2n/i-archive-menu'); await page.keyboard.press('Escape');
await page.goto(H + '/views/all/tickets/' + EM, { waitUntil: 'commit' }).catch(() => {}); await sleep(12000);
const cc = page.getByText('mahmoud.mmohamedsamy@gmail.com').first(); if (await cc.count()) { await cc.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1000); }
o.ccText = (await txt()).replace(/\s+/g, ' ').match(/.{0,200}mmohamedsamy.{0,200}/)?.[0];
o.shotCC = await shot('../wave2n/i-cc-ticket');
const sn = await api('GET', '/desk/snippets'); o.snippets = arr(sn.j && sn.j.data).filter(s => /QA GL W2/.test(s.title || s.name || '')).map(s => [s.id, s.title, s.content_html]);
const r = await api('GET', '/desk/tickets/' + EM + '/replies'); o.ccReply = arr(r.j.data).map(m => [m.created_at, JSON.stringify(m.cc)]);
const t = await api('GET', '/desk/tickets/' + EM + '/cc'); o.ticketCC = t.s + ' ' + t.t.slice(0, 200);
return done(o);
