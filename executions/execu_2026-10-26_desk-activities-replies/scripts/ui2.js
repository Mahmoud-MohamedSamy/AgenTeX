// Read-only: tour /activities, /calendar and a ticket's conversation, logging API calls
const calls = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && !/heartbeat|presence|\/iam\//.test(u)) calls.push(r.method() + ' ' + u.replace(API, '').slice(0, 200)); }; page.on('request', f);
const out = {};
for (const [k, u] of [['activities', '/activities'], ['calendar', '/calendar'], ['views', '/views']]) {
  calls.length = 0; await go(u, 12000);
  out[k] = { url: page.url(), text: (await txt()).slice(0, 2200), calls: [...new Set(calls)], shot: await shot('tavi-' + k) };
}
// first ticket link on the views page
const tl = await page.$$eval('a[href*="/tickets/"], a[href*="/records/"]', as => as.map(a => a.getAttribute('href')).slice(0, 5));
out.ticketLinks = tl;
if (tl[0]) { calls.length = 0; await go(tl[0], 12000); out.ticket = { url: page.url(), text: (await txt()).slice(0, 3000), calls: [...new Set(calls)], shot: await shot('tavi-ticket') }; }
page.off('request', f);
return done(out);
