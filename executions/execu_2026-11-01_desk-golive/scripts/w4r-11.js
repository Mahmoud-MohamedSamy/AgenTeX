const r = await api('POST', '/desk/tickets/f642b146-8c00-4e6e-8b89-82bb5def710d/assign', { owner_id: '9d182dfa-05f3-4af7-9685-8615a2fbe537' }); out.assign = r.s + ' ' + r.t.slice(0, 200);
return fin({ out });
