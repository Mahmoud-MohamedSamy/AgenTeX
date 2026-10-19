const g = await api('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views/8dceae79-4e80-459c-801b-5291dd0714f0');
return done(JSON.stringify(g.j && g.j.data && g.j.data.settings && g.j.data.settings.criteria));
