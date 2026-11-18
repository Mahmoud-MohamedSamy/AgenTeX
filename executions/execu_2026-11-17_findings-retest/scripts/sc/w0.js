const r = await api('GET', '/workflow/rules/b341d0be-71ae-44ef-a314-43a298ae2b98'); return [r.s, r.t.slice(0, 3500)];
