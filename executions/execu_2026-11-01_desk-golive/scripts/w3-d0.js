for (const p of ['/desk/tickets/spam?limit=100', '/desk/spam/contacts', '/desk/tickets/spam/settings', '/desk/channels/spam/settings', '/desk/spam-settings', '/desk/tickets/archive/settings', '/desk/tickets/parent-child/settings']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 300); }
return fin({ out });
