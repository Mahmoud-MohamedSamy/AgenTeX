const o = {}; o.lockLead = (await api('DELETE', `/modules/${M.leads}/records/4e3725cb`)).s;
const all = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=100&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA P3' }]))}`)).j?.data); o.left = all.map(x => x.id); for (const x of all) o['d' + x.id.slice(0, 8)] = (await api('DELETE', `/modules/${M.leads}/records/${x.id}`)).s;
o.tasks = []; for (const t of '7d966c26-b9ad-458d-882c-eb92f254a277'.split(',').filter(Boolean)) o.tasks.push((await api('DELETE', `/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/records/${t}`)).s);
ledger('P3 R: leftovers ' + JSON.stringify(o)); return o;
