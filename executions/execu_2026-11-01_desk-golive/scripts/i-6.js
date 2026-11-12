const o = {}; await go('/settings/channels/email/overview', 10000);
o.tabs = (await txt()).replace(/\s+/g, ' ').slice(0, 1500);
const tabs = await page.locator('a[href*="/settings/channels/email"], [role=tab]').evaluateAll(as => as.map(a => (a.innerText || '').trim() + ' ' + (a.getAttribute('href') || '')));
o.tabLinks = tabs;
const sig = tabs.find(x => /signature/i.test(x)); if (sig) { const h = sig.split(' ').pop(); if (h.startsWith('/')) await go(h, 10000); else await page.getByText(/signature/i).first().click(); await sleep(5000); o.sigText = (await txt()).replace(/\s+/g, ' ').match(/.{0,100}signature.{0,1200}/i)?.[0]; o.shot = await shot('../wave2n/i-company-signature'); }
return done(o);
