let st = 0, t0 = Date.now(); for (let i = 0; i < 24; i++) { const s = await api('GET', '/agents/tia/status?app=crm'); st = s.s; if (st === 403) break; await sleep(30000); }
const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); const c = await confirmA({ id: I2['B-06'].action }); const g = await getRec(M.leads, P3I.leadB);
p3rec('B-06', '?', `Chat with Tia removed from every profile of the user; Tia status became ${st} after ${Math.round((Date.now() - t0) / 1000)} s; confirm of a card made before=${JSON.stringify(c)}; company now=${val(g.rec, 'company')}`);
return { st, c, company: val(g.rec, 'company') };
