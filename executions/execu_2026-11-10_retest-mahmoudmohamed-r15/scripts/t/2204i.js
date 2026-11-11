for (const u of ['/settings/users','/settings/agents','/settings/general/users']) { await page.goto(H + u, { waitUntil: 'domcontentloaded' }); for (let i=0;i<15;i++){ await sleep(2000); if (/Mahmoud Mohamed/.test(await text())) break; } if (/Mahmoud Mohamed/.test(await text())) { log('route', u); break; } }
const t = await text(); const i = t.indexOf('Mahmoud Mohamed'); log(t.slice(Math.max(0,i-600), i+400));
const row = page.locator('tr', {hasText:'Mahmoud Mohamed'}).first(); log('row', await row.count() ? (await row.innerText()).replace(/\s+/g,' ') : 'none');
await shot('2204-users.png');
