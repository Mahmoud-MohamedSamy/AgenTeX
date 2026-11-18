out.r = []; for (const id of ['1499272000000451605', '1499272000000451643', '1499272000000453078', '1499272000000451889']) out.r.push((await api(page, 'GET', 'tickets/' + id)).s);
const rb = await api(page, 'GET', 'recycleBin?limit=100'); out.bin = ((rb.j && rb.j.data) || []).length;
