const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', FOREIGN = '1cb2da03-3a80-4720-9ca6-07c5a3758b85', LAST = '13996de8-93e5-4437-b546-03d1caca1194', GONE = 'ff0a79b9-c822-4fd0-96ab-00c60a88c920';
const ready = async () => { for (let k = 0; k < 60; k++) { await sleep(1000); const t = await txt(); if (/\d+ records/.test(t) && !/Loading Leads/.test(t)) return k; } return 'timeout'; };
const label = async () => ((await txt()).split('Create Lead')[1] || '').split('\n').map(s => s.trim()).filter(Boolean)[0] || '?';
const out = {};
await go('/', 6000); await page.getByText('Leads', { exact: true }).first().click({ force: true }); out.leadsLoad = await ready(); out.start = await label();
const spa = async (id, k) => { const toasts = []; await page.evaluate(u => { history.pushState({}, '', u); dispatchEvent(new PopStateEvent('popstate')); }, `/modules/${L}?view=${id}`); for (let i = 0; i < 12; i++) { await sleep(1000); for (const x of await page.locator('[data-sonner-toast]').allInnerTexts()) if (!toasts.includes(x)) toasts.push(x); } out[k] = { view: await label(), toasts, url: page.url().replace(/.*\/modules\/[^?]+/, '') || '(no query)' }; await shot('2098-s-' + k); };
await spa(LAST, 'own'); await spa(GONE, 'deleted'); await spa(FOREIGN, 'foreign');
out.foreignLeak = (await txt()).includes('QA RT 2098 foreign');
return done(out);
