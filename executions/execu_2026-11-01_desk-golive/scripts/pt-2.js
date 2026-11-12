await page.goto(HC + 'tickets/48326997-5fc4-49c4-8303-ce5c9429bad0', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
const box = page.getByPlaceholder(/reply/i).or(page.locator('main textarea, main [contenteditable=true]')).first();
await box.click(); await page.keyboard.type('QA GL W4 customer reply CUSTREPLY99 from the Help Center.');
const n0 = NET.length; await page.getByRole('button', { name: /^Send reply$/ }).click(); await page.waitForTimeout(6000);
out.sendNet = NET.slice(n0).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.t.slice(0, 120));
out.after = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 600);
await shot('w4/W4-45-customer-reply');
// W4-46: another contact's ticket
for (const id of ['fda559c1-a1d2-4f2d-9920-86747e58d7f8']) {
  await page.goto(HC + 'tickets/' + id, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
  out.other = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300); await shot('w4/W4-46-other-ticket');
}
// the API calls the portal page itself makes for a ticket, replayed with the other id
const apiCalls = NET.filter(x => x.m === 'GET' && /48326997/.test(x.u)).map(x => x.u); out.apiSeen = [...new Set(apiCalls)].slice(0, 5);
out.apiOther = [];
for (const u of out.apiSeen.slice(0, 3)) { const r = await page.request.get('https://staging-crm.taviportal.com' + u.replace('48326997-5fc4-49c4-8303-ce5c9429bad0', 'fda559c1-a1d2-4f2d-9920-86747e58d7f8')); out.apiOther.push(u.replace(/48326997[^/?]*/, '<other>') + ' ' + r.status() + ' ' + (await r.text()).slice(0, 150)); }
