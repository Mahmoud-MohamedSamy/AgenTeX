const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
await go(`/modules/${D}`, 5000); for (let j = 0; j < 40 && !/QA RT r8 deal|No Transactions/.test(await txt()); j++) await sleep(2000); await sleep(2000);
const sel = page.locator('select').first(); out.layoutShown = await sel.evaluate(e => e.options[e.selectedIndex].text).catch(() => '?'); out.found = (await txt()).includes('QA RT r8 deal'); await shot('v11-deals-list');
return done(out);
