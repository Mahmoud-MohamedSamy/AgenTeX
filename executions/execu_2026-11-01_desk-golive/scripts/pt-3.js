await page.goto(HC + 'tickets/48326997-5fc4-49c4-8303-ce5c9429bad0', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
out.reload = body.slice(0, 700); out.seesOwnReply = body.includes('CUSTREPLY99');
await shot('w4/W4-45-portal-after-reload');
const own = NET.find(x => /tickets\/48326997[^/]*\?lang/.test(x.u)); out.ownApi = own ? own.s + ' ' + own.t.slice(0, 300) : 'n/a';
