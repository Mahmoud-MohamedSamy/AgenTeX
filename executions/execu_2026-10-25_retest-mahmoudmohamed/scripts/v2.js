const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', FOREIGN = '1cb2da03-3a80-4720-9ca6-07c5a3758b85', LAST = '13996de8-93e5-4437-b546-03d1caca1194', GONE = 'ff0a79b9-c822-4fd0-96ab-00c60a88c920';
const toasts = []; const watch = async () => { for (let k = 0; k < 60; k++) { await sleep(1000); const tt = await page.locator('[data-sonner-toast]').allInnerTexts(); for (const x of tt) if (!toasts.includes(x)) toasts.push(x); const t = await txt(); if (/\d+ records/.test(t) && !/Loading Leads/.test(t)) break; } await sleep(1500); };
const viewName = async () => (await page.getByRole('button', { name: /Custom views|Choose a view/ }).first().innerText().catch(() => '')) || ((await txt()).split('Meetings')[1] || '').split('\n').slice(0, 10).join(' | ');
const out = {};
await go(`/modules/${L}?view=${LAST}`, 1000); await watch(); out.own = { view: await viewName(), url: page.url() };
toasts.length = 0; await go(`/modules/${L}?view=${GONE}`, 500); await watch(); out.deleted = { toasts: [...toasts], view: await viewName(), url: page.url(), count: (await txt()).match(/(\d+) records/)?.[1] }; await shot('2098-01-deleted-id');
toasts.length = 0; await go(`/modules/${L}?view=${FOREIGN}`, 500); await watch(); out.foreign = { toasts: [...toasts], view: await viewName(), url: page.url(), leaks: (await txt()).includes('QA RT 2098 foreign') }; await shot('2098-02-foreign-id');
await go(`/modules/${L}?view=${LAST}`, 1000); await watch(); await go(`/modules/${L}`, 500); await watch(); out.plain = { view: await viewName(), url: page.url() }; await shot('2098-03-plain-url');
return done(out);
