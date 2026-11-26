const lids = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=100`)).j?.data).map(x => x.id);
fs.writeFileSync(RUN + '/out/k03-rsc-leads.json', JSON.stringify(lids)); const st = (await api('GET', '/agents/tia/status')).j?.data; return { n: lids.length, status: st };
