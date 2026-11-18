const o = {};
const sts = () => [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })];
const b = await mkBp(DEF('F04 tk', sts(), [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')]));
o.bp = E(b.r); o.bpId = b.id;
o.k1 = await mkT('F04 tk', 'K1 owned by owner', { owner: OWNER });
const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject: 'QA RT21 BP-F04 control owned by owner', description: 'QA RT21 BP F04 control, no blueprint', status: 'Open', department: CS, owner: OWNER }) });
o.c1 = r.j?.data?.id; if (o.c1) { made.tickets.push(o.c1); keep(); LED('ticket created ' + o.c1 + ' "QA RT21 BP-F04 control owned by owner" (no blueprint)'); }
o.in = await waitIn(o.k1, 30); await sleep(3000);
for (const k of ['k1', 'c1']) { const x = await rec(o[k]); o[k + 'n'] = x.ticket_number + ' owner=' + (x.owner === OWNER ? 'OWNER' : x.owner) + ' st=' + x.status; }
o.trans = await trans(o.k1);
fs.writeFileSync(RUN + '/scripts/bp/f04.json', JSON.stringify(o, null, 1)); return o;
