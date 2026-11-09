const ev = await api('GET', '/audit/events?limit=12'); const a = ((ev.j && ev.j.data) || []).filter(e => e.actor_label === 'ndc-staging-owner').slice(0, 6);
return done({ keys: a[0] && Object.keys(a[0]), ev: a.map(e => { const c = {}; for (const k of Object.keys(e)) if (!/^source_|actor_|recorded|event_id/.test(k)) c[k] = e[k]; return JSON.stringify(c).slice(0, 600); }) });
