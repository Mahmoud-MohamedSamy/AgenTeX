const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; let hit = null;
for (let i = 0; i < 10 && !hit; i++) { await sleep(4000); const r = await api('GET', `/modules/${TK}/records?limit=20&sort_by=created_at&sort_dir=desc`); hit = L(r.j?.data).map(x => ({ id: x.id, src: x.source, ...flat(x.data) })).find(v => v.subject === 'QA FX H14 webform'); }
if (!hit) { log('ticket not found (maybe held for review)'); return; }
made.tickets.tickets.push(hit.id); keep(); led('Desk ticket from web form ' + hit.id);
log(JSON.stringify({ source: hit.src, channel: hit.channel, department: hit.department, priority: hit.priority, qa_fx_dept: hit.qa_fx_dept, qa_fx_chan: hit.qa_fx_chan, qa_fx_hi: hit.qa_fx_hi, qa_fx_team: hit.qa_fx_team }));
