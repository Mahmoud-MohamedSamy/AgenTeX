const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + String(r.j.error.message).slice(0, 140)) : null, id: r.j && r.j.data && r.j.data.id });
const o = {}; o.bh = S(await api('POST', '/iam/tenant/business-hours/profiles', { name: 'QA GL N agent bh', preset: '24_7', time_zone: 'Africa/Cairo', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], week_starts_on: 'sun' }));
return done(o);
