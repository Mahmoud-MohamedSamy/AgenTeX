// 12 Nov resume, agent C (Desk Agent, Customer Support only): W2-37 shared read-only, W2-76 Marketing ticket hidden, W2-77 actions on CS ticket, W2-85 list/search scope
const o = {}; const BASE = 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9', SHARE = 'a958ebfc-4a5f-489b-9019-a25db0610df0', CS = '30bb8716-cd9a-4e0b-8d49-8a2aa67db1d6';
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const me = await api('GET', '/iam/me'); o.me = me.j && me.j.data && me.j.data.email;
const btns = async () => page.$$eval('button', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(x => /reply|comment|close|edit|assign|pick up|more|delete|move|share|merge/i.test(x)))].slice(0, 20));
// W2-37 shared read-only
const P = `/desk/tickets/${SHARE}`;
const g = await api('GET', P); o.shareGet = g.s + ' ' + (g.j && g.j.data ? [g.j.data.ticket_number, g.j.data.can_edit, JSON.stringify(g.j.data.viewer_access)].join(' ') : '');
o.shareComments = (await api('GET', `${P}/comments`)).s;
o.shareReply = sh(await api('POST', `${P}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: x', body_html: '<p>QA GL W2 C should not send</p>' }));
o.shareComment = sh(await api('POST', `${P}/comments`, { body_html: '<p>QA GL W2 C should not comment</p>', is_public: false }));
o.shareEdit = sh(await patchRec(T, SHARE, { subject: 'QA GL W2 r share edited by C' }));
o.shareClose = sh(await api('POST', `${P}/close`, {}));
await page.goto(H + '/views/all/tickets/' + SHARE, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 r share/, 60); await sleep(3000);
o.shareBanner = ((await txt()).match(/[^\n]{0,80}(shared|read.only|view only)[^\n]{0,80}/i) || [''])[0]; o.shareButtons = await btns(); o.shotShare = await shot('../wave2n/r-c-shared');
// W2-76 Marketing ticket hidden
o.mktGet = (await api('GET', `/desk/tickets/${BASE}`)).s; o.mktRec = (await getRec(T, BASE)).s; o.mktComments = (await api('GET', `/desk/tickets/${BASE}/comments`)).s; o.mktReplies = (await api('GET', `/desk/tickets/${BASE}/replies`)).s;
await page.goto(H + '/views/all/tickets/' + BASE, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(9000);
o.mktScreen = (await txt()).replace(/\s+/g, ' ').slice(0, 250); o.mktLeak = /QA GL W2 r base|r mention/.test(await txt()); o.shotMkt = await shot('../wave2n/r-c-marketing');
// W2-77 actions on own-department ticket
const Q = `/desk/tickets/${CS}`;
const c = await api('GET', Q); o.csGet = c.s + ' ' + (c.j && c.j.data ? [c.j.data.ticket_number, c.j.data.can_edit].join(' ') : '');
await page.goto(H + '/views/all/tickets/' + CS, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 r cs/, 60); await sleep(3000);
o.csButtons = await btns(); const more = page.locator('button[aria-label*="ore"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1500); o.csMore = await page.$$eval('[role=menuitem]', es => es.map(e => e.innerText.trim())); await page.keyboard.press('Escape'); } o.shotCs = await shot('../wave2n/r-c-cs');
o.csDelete = sh(await api('DELETE', `/modules/${T}/records/${CS}`));
o.csMove = sh(await api('POST', `${Q}/move`, { department_id: DQ }));
o.csShare = sh(await api('PUT', `${Q}/shares`, { shares: [{ department_id: DQ, access: 'read_only' }] }));
o.csCsAfter = (await api('GET', Q)).s;
// W2-85 list and search scope
const lr = await api('GET', `/modules/${T}/records?limit=50&q=${encodeURIComponent('QA GL W2')}`); o.listQA = [lr.s, arr(lr.j && lr.j.data).map(fl).map(x => [x.ticket_number, (x.subject || '').slice(0, 25), (x.department || '').slice(0, 8)])];
const sr = await api('GET', '/search?q=' + encodeURIComponent('QA GL W2') + '&app=desk'); o.searchQA = sr.s + ' ' + JSON.stringify((sr.j && sr.j.data && sr.j.data.groups || []).map(gp => (gp.hits || []).map(h => h.title && h.title.text))).slice(0, 400);
const sn = await api('GET', '/search?q=3105&app=desk'); o.search3105 = sn.s + ' ' + JSON.stringify((sn.j && sn.j.data && sn.j.data.groups || []).map(gp => (gp.hits || []).map(h => h.title && h.title.text))).slice(0, 300);
return done(o);
