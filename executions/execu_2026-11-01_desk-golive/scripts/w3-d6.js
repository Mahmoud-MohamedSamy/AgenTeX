const PS = '/desk/tickets/parent-child/settings';
const mkT = async s => { const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv(s) }, { field: 'department', value: sv(MK) }, { field: 'email', value: sv('qa-gl-w3-c1@example.com') }, { field: 'contact_id', value: sv('01402bf2-8d93-4924-bf77-13dab577ea57') }, { field: 'status', value: sv('Open') }] }); const id = t.j?.data?.id; if (id) CREATED.push({ kind: 'ticket', id, name: s }); return id; };
const P = await mkT('QA GL W3 parent'), C1 = await mkT('QA GL W3 child 1'), C2 = await mkT('QA GL W3 child 2');
out.link = (await api('POST', '/desk/tickets/' + P + '/children', { child_ticket_ids: [C1, C2] })).s;
const S = async () => { const r = {}; for (const [k, id] of [['P', P], ['C1', C1], ['C2', C2]]) r[k] = (await get(TM, id)).status; return JSON.stringify(r); };
const close = async id => { const r = await api('POST', '/desk/tickets/' + id + '/close', {}); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 220) : ''); };
const reopen = async id => (await api('PATCH', '/modules/' + TM + '/records/' + id, { data: [{ field: 'status', value: sv('Open') }] })).s;
const set = async (b, a) => (await api('PUT', PS, { parent_close_behavior: b, auto_close_parent: a })).s;
// none
out.none = { set: await set('none', false), close: await close(P) }; await sleep(3000); out.none.after = await S(); await reopen(P); await sleep(1500);
// close_children
out.cc = { set: await set('close_children', false), close: await close(P) }; await sleep(4000); out.cc.after = await S(); for (const id of [P, C1, C2]) await reopen(id); await sleep(2000); out.cc.reopened = await S();
// block
out.blk = { set: await set('block_while_children_open', false), close: await close(P) }; await sleep(2000); out.blk.after = await S();
await go('/views/all/tickets/' + P, 12000); const cb = page.locator('#main-content').getByRole('button', { name: 'Close ticket' }).first(); if (await cb.count()) { await cb.click(); await sleep(3000); out.blk.ui = ((await page.locator('[data-sonner-toast],[role=status],[role=alert],[role=dialog]').allInnerTexts().catch(() => [])).join(' | ')).replace(/\s+/g, ' ').slice(0, 300); await shot('w3/W3-30-block-close-parent'); const dd = page.locator('[role=dialog]'); if (await dd.count()) await page.keyboard.press('Escape'); }
// W3-31 reopen child reopens parent (block mode): close children then parent, reopen C1
await close(C1); await close(C2); await sleep(1500); out.blk.closeAfterKids = await close(P); await sleep(2000); out.blk.allClosed = await S();
await reopen(C1); await sleep(4000); out.blk.afterReopenC1 = await S();
// auto close parent
for (const id of [P, C1, C2]) await reopen(id); await sleep(1500);
out.ac = { set: await set('none', true) }; await close(C1); await sleep(2000); out.ac.afterC1 = await S(); await close(C2); await sleep(5000); out.ac.afterC2 = await S();
out.restore = await set('none', false); out.final = (await api('GET', PS)).t.slice(0, 150);
return fin({ out });
