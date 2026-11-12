const o = {};
for (const p of ['/mail/signatures', '/mail/signatures/company', '/mail/company-signature', '/mail/signatures/org', '/desk/settings/signature', '/mail/settings']) { const r = await api('GET', p); o[p] = r.s + ' ' + r.t.slice(0, 400); }
const s = await page.evaluate(async () => { const out = []; for (const sc of [...document.querySelectorAll('script[src]')]) { const t = await (await fetch(sc.src)).text(); out.push(...(t.match(/.{0,60}signature.{0,60}/gi) || []).filter(x => /get\(|post\(|put\(|`\//.test(x)).slice(0, 20)); } return out; });
o.bundle = [...new Set(s)].slice(0, 25);
return done(o);
