// NDC-2098 with long waits: each case is a full load of /modules/{Leads}?view=<id>; toasts are captured for the whole load.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', FOREIGN = '1cb2da03-3a80-4720-9ca6-07c5a3758b85', LAST = '13996de8-93e5-4437-b546-03d1caca1194', GONE = 'ff0a79b9-c822-4fd0-96ab-00c60a88c920';
const CASE = globalThis.__case;
const id = { own: LAST, deleted: GONE, foreign: FOREIGN, plain: null }[CASE];
const toasts = [];
await page.goto(H + `/modules/${L}` + (id ? `?view=${id}` : ''), { waitUntil: 'commit' });
let loadedAt = null;
for (let k = 0; k < 120; k++) { await sleep(1000); for (const x of await page.locator('[data-sonner-toast]').allInnerTexts()) if (!toasts.includes(x)) toasts.push(x); const t = await txt().catch(() => ''); if (!loadedAt && /\d+ records/.test(t) && !/Loading Leads/.test(t)) { loadedAt = k + 1; } if (loadedAt && k > loadedAt + 15) break; }
const t = await txt(); const label = (t.split('Create Lead')[1] || '').split('\n').map(s => s.trim()).filter(Boolean)[0] || '?';
await shot('2098-L-' + CASE);
return done({ CASE, loadedAfterSec: loadedAt, view: label, toasts, query: page.url().split('?')[1] || '(none)', foreignNameShown: t.includes('QA RT 2098 foreign'), count: t.match(/(\d+) records/)?.[1] });
