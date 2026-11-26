const shot = async n => { await page.screenshot({ path: RUN + '/zoho/' + n + '.png' }); log('shot', n, page.url()); };
const body = async () => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
await sleep(4000); await shot('u2-leads');
const setup = page.locator('[data-zcqa="setup"], [aria-label*="Setup" i], [title*="Setup" i]').first(); log('setup visible', await setup.isVisible().catch(() => false));
await setup.click().catch(e => log('setup click', e.message.split('\n')[0])); for (let i = 0; i < 30; i++) { await sleep(2000); if (/Modules and Fields/.test(await body())) break; } await shot('u2-setup');
await page.getByText('Modules and Fields', { exact: true }).first().click().catch(e => log('mf', e.message.split('\n')[0])); for (let i = 0; i < 40; i++) { await sleep(2000); const b = await body(); if (/Leads/.test(b) && !/Loading/.test(b)) break; } await sleep(3000); await shot('u2-modules');
log((await body()).slice(0, 600));
