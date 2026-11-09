const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + String(r.j.error.message).slice(0, 140)) : null, id: r.j && r.j.data && r.j.data.id });
o.bh = S(await api('POST', '/iam/tenant/business-hours/profiles', { name: 'QA GL N agent bh', preset: '24_7', time_zone: 'Africa/Cairo' }));
o.holiday = S(await api('POST', '/desk/holiday-lists', { name: 'QA GL N agent holidays', category: 'recurring' }));
o.team = S(await api('POST', '/desk/teams', { name: 'QA GL N agent team', department_id: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158' }));
o.company = S(await api('PUT', '/iam/tenant/company-profile/branding', { logo_linkback_url: null, favicon_url: null }));
o.perms = JSON.stringify((await api('GET', '/iam/me/permissions')).j.data).slice(0, 1500);
return done(o);
