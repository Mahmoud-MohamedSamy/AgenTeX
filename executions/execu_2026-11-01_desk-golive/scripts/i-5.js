const o = {};
for (const h of ['/settings/signatures', '/settings/company/signature', '/settings/channels/email', '/settings/email', '/settings/company', '/settings/rebranding', '/settings/channels/email/signature', '/settings/email/signatures']) { await go(h, 8000); const t = (await txt()).replace(/\s+/g, ' '); o[h] = page.url().replace(/^https:\/\/[^/]+/, '') + ' :: ' + ((t.match(/.{0,200}signature.{0,400}/i) || [t.slice(0, 120)])[0]); }
return done(o);
