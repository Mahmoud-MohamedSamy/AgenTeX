// NDC-2117: wait for the pending Save, then API duplicate / empty / 121 checks.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const out = {};
for (let k = 0; k < 40; k++) { await sleep(1000); const t = await txt(); if (t.includes('You already have a view with this name.') || !/\/views\/new/.test(page.url())) break; }
out.ui = { hasMsg: (await txt()).includes('You already have a view with this name.'), url: page.url().replace(/.*\/modules\/[^/?]+/, '') };
await shot('2117-05-duplicate-exact');
const post = async n => { const r = await api('POST', `/modules/${L}/views`, { name: n, kind: 'list', visibility: 'private', settings: { criteria: { conditions: [] } } }); return { s: r.s, id: r.j?.data?.id, t: r.j?.data?.id ? '' : r.t.slice(0, 200) }; };
out.apiExact = await post('QA RT 2098 last');
out.apiUpper = await post('QA RT 2098 LAST');
out.apiTrail = await post('QA RT 2098 last ');
out.apiEmpty = await post('   ');
out.api121 = await post('QA RT ' + 'z'.repeat(115));
const v = await api('GET', `/modules/${L}/views`); out.mine = (v.j?.data || []).filter(x => /^qa rt/i.test(x.name)).map(x => x.id.slice(0, 8) + ' ' + JSON.stringify(x.name.slice(0, 30)));
return done(out);
