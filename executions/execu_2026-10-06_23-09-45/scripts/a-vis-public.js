
// agent: Public Read/Write/Delete
const enc = v => ({ kind: 'string', value: v });
const recs = arr((await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records?page_size=50')).j.data);
const own = recs.filter(r => /agent/.test(JSON.stringify(r)));
const ownerRecs = recs.filter(r => /owner rec/.test(JSON.stringify(r)));
let mine = own[0] && own[0].id; if (!mine) { const c = await api('POST', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records', { data: [{ field: 'name', value: enc('QA MF agent rec H6') }] }); mine = c.j && c.j.data && c.j.data.id; }
const allIds = (await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records?page_size=50')).j; const visible = arr(allIds && allIds.data).length;
const target = ownerRecs[0] && ownerRecs[0].id;
const eo = target ? await api('PATCH', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + target, { data: [{ field: 'qa_vis', value: enc('agent edit H6') }] }) : { s: '-' };
const em = mine ? await api('PATCH', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + mine, { data: [{ field: 'qa_vis', value: enc('agent own edit H6') }] }) : { s: '-' };
const go1 = target ? await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records/' + target) : { s: '-' };
rec('H6.agent', 'INFO', 'records visible to agent: ' + visible + ' (owner records seen: ' + ownerRecs.length + '); GET an owner record → ' + go1.s + '; PATCH owner record → ' + eo.s + '; PATCH own record → ' + em.s + ' (own record ' + (mine ? 'present' : 'NOT created') + ')', { ownerSeen: ownerRecs.length, eo: eo.s, em: em.s, go1: go1.s, visible });
return done();