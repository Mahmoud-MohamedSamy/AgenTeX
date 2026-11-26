const o = {}; const K = ST.K;
const P = (id, v, note) => { result(id, v, note); o[id] = v + ' ' + note; };
const k1 = (await api.B('GET', '/desk/approvals/' + K['K1 default'].id)).j?.data?.item;
const kf = (await api.B('GET', '/desk/approvals/' + K['K1 form'].id)).j?.data?.item;
const k3 = (await api.A('GET', '/desk/approvals/' + K['K3 remind'].id)).j?.data?.item;
o.k1 = { due: k1?.due_at, overdue: k1?.overdue, reminded: k1?.approval?.last_reminded_at }; o.kf = { due: kf?.due_at, overdue: kf?.overdue }; o.k3 = { overdue: k3?.overdue, reminded: k3?.approval?.last_reminded_at };
const cnt = (await inbox('B', { list: 'waiting' })).d?.counts; o.countsB = cnt;
const ov = (await inbox('B', { list: 'waiting', waiting: 'overdue', page_size: 100 })).d?.approvals || []; o.overdueIds = ov.length;
const has = id => ov.some(x => x.id === id);
P('K1', k1?.overdue && kf?.overdue ? 'PASS' : 'FAIL', `default limit 1 h item due ${k1?.due_at}, overdue ${JSON.stringify(k1?.overdue)}; form "decide within 1 h" item due ${kf?.due_at}, overdue ${JSON.stringify(kf?.overdue)} (department 24x7; blueprint step limit not available in the designer data)`);
P('K5', has(K['K1 default'].id) && has(K['K1 form'].id) && cnt?.overdue >= 2 ? 'PASS' : 'FAIL', `B overdue filter has K1 ${has(K['K1 default'].id)}, form ${has(K['K1 form'].id)}; overdue count ${cnt?.overdue}; UI shows "Overdue" / "Overdue N days" badges (owner pass)`);
// K3 automatic reminder: notifications for B and D after the limit
const nB = arr((await api.B('GET', '/notifications?limit=100')).j?.data?.notifications || (await api.B('GET', '/notifications?limit=100')).j?.data).filter(x => /K1 default|K3 remind|K1 form/.test(JSON.stringify(x)));
const nD = arr((await api.D('GET', '/notifications?limit=100')).j?.data?.notifications || []).filter(x => /K3 remind|K1 form/.test(JSON.stringify(x)));
o.nB = nB.map(x => x.event_type + ' ' + x.created_at); o.nD = nD.map(x => x.event_type + ' ' + x.created_at);
const auto = nB.filter(x => /remind|overdue/.test(x.event_type));
P('K3', auto.length ? 'PASS' : 'FAIL', `in-app after the limit: B ${JSON.stringify(o.nB)}; D ${JSON.stringify(o.nD)}; approval last_reminded_at K1 ${k1?.approval?.last_reminded_at}. Email not checked`);
ST.K.checkedAt = new Date().toISOString(); saveState(); return o;
