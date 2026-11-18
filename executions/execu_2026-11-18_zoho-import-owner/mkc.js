const r = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 Import', email: 'qa-rt22-import@example.com' });
out.s = r.s; out.id = r.j && r.j.id; out.t = r.s >= 300 ? r.t : undefined;
