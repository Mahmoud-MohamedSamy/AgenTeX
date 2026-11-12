const o = {};
for (const n of ['Rebranding', 'Company', 'Email Templates']) { await page.getByText(n, { exact: true }).first().click().catch(e => o['e' + n] = String(e).slice(0, 60)); await sleep(8000); const t = (await txt()).replace(/\s+/g, ' '); o[n] = page.url().replace(/^https:\/\/[^/]+/, '') + ' :: ' + ((t.match(/.{0,300}signature.{0,600}/i) || ['-'])[0]);
  if (/signature/i.test(t)) { const s = page.getByText(/signature/i).nth(0); await s.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1200); o['shot' + n] = await shot('../wave2n/i-sig-' + n.replace(' ', '')); } }
return done(o);
