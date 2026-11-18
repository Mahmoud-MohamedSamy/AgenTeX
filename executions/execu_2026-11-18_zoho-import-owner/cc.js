const cs = await api(page, 'GET', 'contacts/search?lastName=QA%20RT22*&limit=10');
out.s = cs.s; out.d = (cs.j && cs.j.data || []).map(x => ({ id: x.id, n: x.lastName, created: x.createdTime }));
out.get = (await api(page, 'GET', 'contacts/1499272000000485548')).s;
