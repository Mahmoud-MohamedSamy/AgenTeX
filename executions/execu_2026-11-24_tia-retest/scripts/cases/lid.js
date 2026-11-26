const r = await api('GET', `/modules/${M.leads}/records?page=1&per_page=1`); return arr(r.j?.data)[0]?.id;
