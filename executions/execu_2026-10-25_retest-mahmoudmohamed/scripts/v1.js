const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', FOREIGN = '1cb2da03-3a80-4720-9ca6-07c5a3758b85';
const mk = async name => (await api('POST', `/modules/${L}/views`, { name, kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'lead_source', operator: 'equals', value: 'web' }] } } })).j?.data?.id;
const last = await mk('QA RT 2098 last'); const gone = await mk('QA RT 2098 gone'); const del = await api('DELETE', `/modules/${L}/views/${gone}`);
const headView = async () => { for (let k = 0; k < 25; k++) { await sleep(1000); const t = await txt(); if (/records\n/.test(t) && !/Loading/.test(t)) break; } await sleep(1500); const t = await txt(); return (t.split('Meetings')[1] || '').split('\n').slice(0, 8).join(' | '); };
const out = { last, gone, delete: del.s };
await go(`/modules/${L}?view=${last}`, 4000); out.ownViaUrl = await headView(); out.ownUrl = page.url();
const toastOf = async () => (await page.locator('[data-sonner-toast]').allInnerTexts()).join(' || ');
await go(`/modules/${L}?view=${gone}`, 2500); const t1 = await toastOf(); out.deleted = { toast: t1, head: await headView(), url: page.url() }; await shot('2098-01-deleted-id');
await go(`/modules/${L}?view=${FOREIGN}`, 2500); const t2 = await toastOf(); out.foreign = { toast: t2, head: await headView(), url: page.url(), leaks: (await txt()).includes('QA RT 2098 foreign') }; await shot('2098-02-foreign-id');
// make "last" the last-used view again by opening it, then plain URL
await go(`/modules/${L}?view=${last}`, 6000); await go(`/modules/${L}`, 2000); out.plain = { head: await headView(), url: page.url() }; await shot('2098-03-plain-url');
return done(out);
