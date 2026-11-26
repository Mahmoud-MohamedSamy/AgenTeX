const r = arr((await api('GET', `/modules/${M.leads}/records?page=3&per_page=100`)).j?.data); const d = r[0]?.data;
return { n: r.length, dataType: Array.isArray(d) ? 'array' : typeof d, sample: JSON.stringify(d).slice(0, 600) };
