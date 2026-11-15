const TK = 'f642b146-8c00-4e6e-8b89-82bb5def710d'; const M = async () => (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
out.api = (await api('GET', '/modules/' + TM + '/records/' + TK)).s;
await go('/views/all/tickets/' + TK, 12000); const t = await M(); out.page = (t.match(/.{0,80}(Happiness|rated|Rating|Good|W4R good).{0,100}/gi) || []).slice(0, 6);
await shot('w4/W4-78-agentB-ticket');
const tabs = await page.locator('main').getByRole('tab').allInnerTexts().catch(() => []); out.tabs = tabs;
const more = page.locator('main').getByText(/Happiness|Rating/i).first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(3000); out.after = ((await M()).match(/.{0,100}(Good|W4R good).{0,100}/i) || [])[0]; await shot('w4/W4-78-agentB-rating'); }
const edit = await page.locator('main').getByRole('button', { name: /edit rating|change rating/i }).count(); out.editBtn = edit;
const hr = await api('GET', '/desk/happiness/ratings?limit=50'); out.ratingsApi = hr.s + ' ' + arr(D(hr.j)).filter(x => x.ticket_number == 3929).map(x => x.rating).join(',');
return fin({ out });
