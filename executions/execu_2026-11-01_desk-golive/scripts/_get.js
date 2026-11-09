const out = {};
for (const p of ["/iam/profiles","/iam/org-units","/iam/tenant/company-profile","/iam/tenant/business-hours/profiles","/mail/signatures/me","/desk/ticket-statuses"]) { try { const r = await api('GET', p); out[p] = { s: r.s, j: r.j }; } catch (e) { out[p] = { s: 'ERR', e: String(e.message).slice(0, 80) }; } }
return done(out);
