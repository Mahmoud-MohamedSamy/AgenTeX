// Owner: drafts for review (W2-57/58), mention via the screen (W2-23/74)
const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
for (const [k, id] of [['base', IDS.base], ['email', IDS.email]]) { const P = `/desk/tickets/${id}`;
  o[k + 'Draft'] = sh(await api('PUT', `${P}/drafts/mine`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 review ' + k, body_html: '<p>QA GL W2 reviewed reply (' + k + ') — go-live test, please ignore.</p>' }));
  o[k + 'Submit'] = sh(await api('POST', `${P}/drafts/mine/submit-review`, {})); const g = await api('GET', `${P}/drafts`); o[k + 'Drafts'] = arr(g.j && g.j.data).map(d => [d.id, d.review_status || d.status, d.author_user_id === ME]); }
// mention B through the comment editor
await page.goto(H + '/views/all/tickets/' + IDS.base, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(2000);
const cbtn = page.locator('button[aria-label="Add a comment"], button[title*="omment"], button:has-text("Comment")').first(); o.commentBtn = await cbtn.count();
if (o.commentBtn) await cbtn.click().catch(() => {}); else { await page.keyboard.press('Escape'); await page.keyboard.press('Shift+C'); }
await sleep(2500); const ed = page.locator('[contenteditable=true]').last(); o.editor = await ed.count();
if (o.editor) { await ed.click().catch(() => {}); await page.keyboard.type('QA GL W2 UI mention ', { delay: 30 }); await page.keyboard.type('@mahmoud.ma', { delay: 80 }); await sleep(3000);
  o.suggest = await page.$$eval('[role=option], [role=listbox] *, [data-mention-item], .mention-list *', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(Boolean))].slice(0, 8));
  o.shotSuggest = await shot('../wave2n/ui-mention-suggest');
  const opt = page.locator('[role=option]').filter({ hasText: /mahmoud.mahamed1515/ }).first(); if (await opt.count()) await opt.click().catch(() => {}); else await page.keyboard.press('Enter');
  await sleep(800); await page.keyboard.type(' please check', { delay: 20 });
  const add = page.locator('button', { hasText: /^(Add comment|Comment|Add|Save|Post)$/ }).last(); o.addBtn = await add.count(); if (o.addBtn) await add.click().catch(() => {}); else await page.keyboard.press('Control+Enter');
  await sleep(5000); o.shotMention = await shot('../wave2n/ui-mention-added'); }
const lc = await api('GET', `/desk/tickets/${IDS.base}/comments`); const c = arr(lc.j && lc.j.data).filter(x => /UI mention/.test(x.body_html || '')); o.uiMention = c.map(x => ({ id: x.id, mentions: x.mentions || x.mentioned_user_ids, body: (x.body_html || '').slice(0, 300) }));
return fin(o);
