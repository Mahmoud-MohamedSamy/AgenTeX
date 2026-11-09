const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }); page.on('pageerror', e => errs.push('PAGEERROR ' + String(e.message).slice(0, 200)));
const failed = []; page.on('requestfailed', r => failed.push(r.url().replace(H, '').slice(0, 100) + ' ' + (r.failure() && r.failure().errorText)));
await page.goto(H + '/login', { waitUntil: 'commit', timeout: 120000 }).catch(e => errs.push('GOTO ' + e.message.slice(0, 100)));
for (let i = 0; i < 90; i++) { await sleep(2000); if (await page.locator('input[type=password]').count()) break; }
return JSON.stringify({ pw: await page.locator('input[type=password]').count(), body: (await txt().catch(() => '')).slice(0, 200), errs: errs.slice(0, 10), failed: failed.slice(0, 10), url: page.url() });
