const r = await api('POST', '/workflow/assignment-rules', { moduleId: 'x', allowedChannels: ['zz'] }); return done({ e: r.t.slice(0, 500) });
