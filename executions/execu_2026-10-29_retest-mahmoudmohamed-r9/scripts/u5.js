// NDC-2388: Leads › Lead Conversion Mapping › Conversion Targets after creating QA RT partners.
page.on('dialog', d => d.accept().catch(() => {}));
const net = []; page.on('response', async r => { if (/conversion/i.test(r.url()) && r.request().method() === 'GET') net.push({ u: r.url().replace(/^.*\/api\/v1/, ''), t: (await r.text().catch(() => '')).slice(0, 1500) }); });
await go('/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3', 15000);
const tab = page.getByText(/Lead Conversion/i).first(); if (await tab.count()) { await tab.click({ force: true }); await sleep(6000); }
await shot('2388-01-conversion-targets');
const t = (await txt()).split('\n').filter(l => l.trim()); const k = t.findIndex(l => /Conversion Targets/i.test(l));
return done({ url: page.url(), seg: t.slice(Math.max(0, k), k + 40), net: net.map(n => n.u + ' ' + (n.t.match(/QA RT partners[^}]{0,200}/) || [''])[0]) });
