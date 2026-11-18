const t = await mkT('3056 cond', 'D6 read-only ticket', { priority: 'low', owner: OWNER }); await waitIn(t); const r = await rec(t);
fs.writeFileSync(RUN + '/scripts/bp/d6.json', JSON.stringify({ t, n: r.ticket_number }, null, 1)); return { t, n: r.ticket_number, owner: r.owner === OWNER };
