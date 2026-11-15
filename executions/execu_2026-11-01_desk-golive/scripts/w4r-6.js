const TK = 'f642b146-8c00-4e6e-8b89-82bb5def710d';
const LINK = 'https://staging-desk.taviportal.com/happiness/dh1.a7a7a7a7000000000000000000000004.H0kpE6GY_OWjW-BUtdfRE_ASRmxo7tbMMEc-9nb2LL8';
for (const p of ['/desk/happiness/ratings?ticket_id=' + TK, '/desk/tickets/' + TK + '/happiness', '/desk/happiness/ratings?limit=5']) { const r = await api('GET', p); out[p.split('?')[0].split('/').slice(-2).join('/') + (p.includes('ticket_id') ? '?t' : '')] = r.s + ' ' + JSON.stringify(D(r.j)).slice(0, 500); }
const rec = flat(D((await api('GET', '/modules/' + TM + '/records/' + TK)).j) || {}); out.tRating = Object.fromEntries(Object.entries(rec).filter(([k]) => /happi|rating/i.test(k)));
const p2 = await page.context().newPage(); await p2.goto(LINK, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p2.waitForTimeout(6000);
out.page = (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 600); await p2.screenshot({ path: SHOT + '/w4/r-rating-page.png' }); await p2.close();
return fin({ out });
