const o = {}; const T3 = 'adfe7f1f-526a-4e36-a951-8a95ab1c3920', T4 = 'f50e00dc-3f08-4d01-8a41-6e81f2db9fdd'; const B = X.ids.DEPT_B; const A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 250) : ''}`.trim();
o.share = []; for (const sh of [[{ department_id: B, access: 'full' }], { department_id: B, access: 'full' }, { department_id: B, access_level: 'full' }, { targets: [{ department_id: B, access: 'full' }] }, { items: [{ department_id: B, access: 'full' }] }]) { const r = await X.run(T4, 'alt', 'Open', { share: sh }); o.share.push(JSON.stringify(sh).slice(0, 50) + ' → ' + full(r)); if (r.s === 200) break; }
o.after4 = await st(T4);
const r = await X.run(T3, 'hold', 'Open', { approval: { subject: 'QA RT12 2754 approval', approver_user_ids: [A3], description: 'QA retest r12' } }); o.approval = full(r); o.after3 = await st(T3);
o.approvals = (await api('o', 'GET', `desk:/desk/tickets/${T3}/approvals`)).t.slice(0, 500);
return o;
