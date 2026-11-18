const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f04.json', 'utf8')); const o = { t: new Date().toISOString() };
const tr = await api('GET', `/modules/${TK}/records/${J.k1}/blueprint-transitions`); o.transRaw = tr.t.slice(0, 700);
o.run = E(await runT(J.k1, 'onlyA')); o.tRun = new Date().toISOString();
o.edit = E(await api('PATCH', '/modules/' + TK + '/records/' + J.k1, { data: fields({ priority: 'High' }) }));
await sleep(4000);
o.afterRec = E(await api('GET', '/modules/' + TK + '/records/' + J.k1)); const d = await api('GET', '/desk/tickets/' + J.k1); o.afterDesk = E(d) + ' st=' + (d.j?.data?.status || '');
return o;
