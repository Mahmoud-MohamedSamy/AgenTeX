// NDC-2098: ?view= with own / deleted / foreign view ids on the Leads records page, then a plain URL.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', FOREIGN = '1cb2da03-3a80-4720-9ca6-07c5a3758b85', LAST = '13996de8-93e5-4437-b546-03d1caca1194', GONE = 'ff0a79b9-c822-4fd0-96ab-00c60a88c920';
const toasts = [];
const grab = async () => { for (const x of await page.locator('[data-sonner-toast]').allInnerTexts()) if (!toasts.includes(x)) toasts.push(x); };
const watch = async () => { for (let k = 0; k < 60; k++) { await sleep(1000); await grab(); const t = await txt(); if (/\d+ records/.test(t) && !/Loading Leads/.test(t)) break; } await sleep(2000); await grab(); };
const viewLabel = async () => { const t = await txt(); const after = (t.split('Create Lead')[1] || ''); return after.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 2).join(' / '); };
const out = {};
for (const [k, id] of [['own', LAST], ['deleted', GONE], ['foreign', FOREIGN]]) {
  toasts.length = 0; await go(`/modules/${L}/records?view=${id}`, 500); await watch();
  out[k] = { view: await viewLabel(), toasts: [...toasts], url: page.url().replace(/.*\/modules\/[^/?]+/, ''), leaksForeignName: (await txt()).includes('QA RT 2098 foreign') };
  await shot(`2098-r-${k}`);
}
await go(`/modules/${L}/records`, 500); await watch(); out.plain = { view: await viewLabel(), url: page.url().replace(/.*\/modules\/[^/?]+/, '') }; await shot('2098-r-plain');
return done(out);
