const o = { loc: [], code: [] };
for (const f of ['/locales/en/crm-emails.json', '/locales/en/settings.json', '/locales/en/desk.json']) { const t = await (await fetch(H + f)).text(); o.loc.push(...(t.match(/"[^"]*"\s*:\s*"[^"]*[Cc]ompany signature[^"]*"/g) || []).slice(0, 8).map(x => f.split('/').pop() + ' ' + x)); }
const res = await page.evaluate(() => performance.getEntriesByType('resource').map(r => r.name).filter(n => /\.js$/.test(n)));
for (const src of res) { const t = await (await fetch(src)).text().catch(() => ''); const m = t.match(/.{0,70}signatures.{0,70}/g) || []; o.code.push(...m.map(x => src.split('/').pop() + ': ' + x)); }
o.code = [...new Set(o.code)].slice(0, 25);
const keys = ['/mail/signatures/company', '/mail/company-signature', '/crm/email/settings', '/mail/signatures/org']; for (const p of keys) o[p] = (await api('GET', p)).s;
return done(o);
