const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8')); const o = {};
o.runR2_onlyA = E(await runT(J.r2, 'onlyA'));
o.runR2_shared = E(await runT(J.r2, 'shared'));
o.editR1 = E(await api('PATCH', '/modules/' + TK + '/records/' + J.r1, { data: fields({ priority: 'High' }) }));
o.editR2 = E(await api('PATCH', '/modules/' + TK + '/records/' + J.r2, { data: fields({ priority: 'High' }) }));
o.editK1 = E(await api('PATCH', '/modules/' + TK + '/records/' + J.k1, { data: fields({ priority: 'High' }) }));
o.r2after = (await api('GET', '/desk/tickets/' + J.r2)).j?.data?.status;
return o;
