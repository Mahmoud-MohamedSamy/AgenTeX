const m = await api('GET', '/iam/me'); out.s = m.s; out.keys = JSON.stringify(m.j).slice(0, 300).replace(/[w.+-]+@[w.-]+/g, 'EMAIL');
return fin({ out });
