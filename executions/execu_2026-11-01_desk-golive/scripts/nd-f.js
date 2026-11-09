// Owner: collision (W2-51) while B's composer is open; email draft state; new approval for B to reject
const o = {}; const P = `/desk/tickets/${IDS.base}`;
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
o.hbOwner = sh(await api('POST', `${P}/viewers/heartbeat`, { replying: false }));
await page.goto(H + '/views/all/tickets/' + IDS.base, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(6000);
const t = await txt(); o.collisionText = (t.match(/[^\n]{0,60}(viewing|replying|is also|are also|typing)[^\n]{0,60}/gi) || []).slice(0, 4); o.shotCollision = await shot('../wave2n/ui-collision-owner');
o.hbOwner2 = sh(await api('POST', `${P}/viewers/heartbeat`, { replying: false }));
const ed = await api('GET', `/desk/tickets/${IDS.email}/drafts`); o.emailDrafts = arr(ed.j && ed.j.data).map(d => [d.id, d.review_state, d.author_user_id === ME]);
const ap = await api('POST', `${P}/approvals`, { subject: 'QA GL W2 approval reject 2', description: 'Go-live test, B rejects it', approver_user_ids: [UB] }); o.ap = sh(ap);
const tk = await getRec(T, IDS.email); o.emailOwner = tk.o && tk.o.owner; const bk = await getRec(T, IDS.base); o.baseOwner = bk.o && bk.o.owner;
return fin(o);
