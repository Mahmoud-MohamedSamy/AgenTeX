const out = {};
for (const id of ['517c1e27-2efe-445f-aad5-1cc55b845805', 'a9ce4860-fc06-454b-876b-5d2b533f5e82', '2d5302f9-89ce-4f74-9d7b-6c176744ff23']) { const r = await api('POST', '/workflow/rules/' + id + '/deactivate'); out[id] = r.s + ' ' + (r.j && r.j.data ? 'isActive=' + r.j.data.isActive : r.t.slice(0, 150)); }
return done(out);
