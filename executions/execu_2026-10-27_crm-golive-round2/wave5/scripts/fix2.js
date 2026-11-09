const res = {};
await page.goto(H + '/dashboards/view/dcb5e49b-683c-4bb3-a5c4-a535f0e71cb6', { waitUntil: 'domcontentloaded' }); await sleep(7000);
const m = page.locator('[aria-label="More actions"]');
res.n = await m.count(); res.tag = res.n ? await m.first().evaluate(e => e.tagName + ' visible=' + (e.offsetParent !== null) + ' ' + JSON.stringify(e.getBoundingClientRect())) : null;
if (res.n) { await m.first().click({ force: true }).catch(e => res.err = e.message.slice(0, 100)); await sleep(1500); res.menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu], [role=menuitem]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || ').slice(0, 800)); await shot('s03-more-actions'); }
return res;
