const S0 = (await api('GET', '/desk/happiness/settings')).j?.data; const keep = o => Object.fromEntries(Object.entries(o).filter(([k]) => !/_max$|_min$|option_icons|public_page_configured/.test(k)));
const r = await api('PUT', '/desk/happiness/settings', { ...keep(S0), is_enabled: true });
return { was: S0?.is_enabled, put: r.s, now: (await api('GET', '/desk/happiness/settings')).j?.data?.is_enabled, at: new Date().toISOString() };
