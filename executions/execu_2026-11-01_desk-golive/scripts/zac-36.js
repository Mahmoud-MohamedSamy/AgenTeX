const YS = {"Y1":"1499272000000493016","Y2":"1499272000000493055","Y3":"1499272000000493094","Y4":"1499272000000493139","Y5":"1499272000000493178","Y6":"1499272000000493232"};
const TE = '1499272000000006907', TC = '1499272000000432293', A1 = '1499272000000432003';
const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
out.unshare = await pr('PATCH', 'tickets/' + YS.Y1, { sharedDepartments: [] });
out.sh1 = JSON.stringify((await api(page, 'GET', 'tickets/' + YS.Y1)).j.sharedDepartments);
out.spam = []; for (const [p, b] of [['tickets/markSpam', { ids: [YS.Y2], isSpam: true, handleExistingTickets: false }], ['tickets/markAsSpam', { ticketIds: [YS.Y2] }]]) { const s = await pr('POST', p, b); out.spam.push(p + ' ' + s); if (/^2/.test(s)) break; }
await page.waitForTimeout(3000); const y2 = (await api(page, 'GET', 'tickets/' + YS.Y2)).j; out.y2 = JSON.stringify({ spam: y2.isSpam, shared: y2.sharedDepartments });
out.folBefore = (await api(page, 'GET', 'tickets/' + YS.Y3 + '/followers')).t.slice(0, 200);
out.move = await pr('POST', 'tickets/' + YS.Y3 + '/move', { departmentId: TC }); await page.waitForTimeout(3000);
out.folAfter = (await api(page, 'GET', 'tickets/' + YS.Y3 + '/followers')).t.slice(0, 200);
// light agent in team
const a1 = (await api(page, 'GET', 'agents/' + A1)).j; out.a1orig = [a1.profileId, a1.roleId, a1.rolePermissionType].join(' ');
out.toLight = await pr('PATCH', 'agents/' + A1, { profileId: '1499272000000067003', roleId: '1499272000000067005' });
const a1b = (await api(page, 'GET', 'agents/' + A1)).j; out.a1now = [a1b.profileId, a1b.roleId, a1b.rolePermissionType].join(' ');
out.team = await pr('POST', 'teams', { name: 'QA AC2 Light Team', departmentId: TE, description: 'access run, delete after', agentIds: [A1] });
