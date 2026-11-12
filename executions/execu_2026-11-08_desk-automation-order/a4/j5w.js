const o = JSON.parse(fs.readFileSync('../a4/j5-out.json', 'utf8')); let w = [];
for (let i = 0; i < 90; i++) { w = (await execs(o.t)).filter(e => e.rule === o.jw); if (w.some(e => e.outcome === 'Fired')) break; await sleep(60000); }
const R = { wall: w.map(e => e.outcome), seenUtc: new Date().toISOString(), expectWallUtc: o.expectWallUtc };
for (const id of [o.jb, o.jw]) R['del ' + id.slice(0, 8)] = (await api('DELETE', '/workflow/rules/' + id)).s;
R.delTicket = (await api('DELETE', `/modules/${T}/records/${o.t}`)).s; log(JSON.stringify(R));
