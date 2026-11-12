const lt = await (await fetch(H + '/locales/en/crm-emails.json')).text(); const i = lt.indexOf('One company signature');
const o = { block: (lt.slice(Math.max(0, i - 1500), i + 2000).match(/"[A-Za-z]+"s*:s*"[^"]{0,160}"/g) || []).filter(x => !/token|cookie|password/i.test(x)) };
for (const p of ['/mail/company-signature', '/mail/signature', '/mail/signatures/company-signature', '/crm/mail/company-signature', '/mail/settings/signature', '/mail/company_signature', '/email/company-signature', '/mail/org-signature']) o[p] = (await api('GET', p)).s;
return done(o);
