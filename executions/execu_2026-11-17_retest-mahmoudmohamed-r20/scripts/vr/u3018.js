const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const LID = 'c5bbf73c-0a86-48b4-a8bc-4f394b4e11e5'; const R = {};
await page.goto(H + '/modules/' + MID + '/records/new?layout=' + LID, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field="qa_rt18v_text"]', { timeout: 90000 }); await sleep(3000);
await page.locator('[data-rule-field="first_name"] input').first().fill('QA RT20 VR 3018 ui');
await page.locator('[data-rule-field="last_name"] input').first().fill('QA RT20 VR 3018').catch(()=>{});
const t = page.locator('[data-rule-field="qa_rt18v_text"] input').first(); await t.scrollIntoViewIfNeeded(); await t.fill('BAD-rt20'); await t.press('Tab'); await sleep(500);
// record live regions present before save, and watch text changes inside live regions / alerts
await page.evaluate(() => { window.__liv = []; const isLive = e => { for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const r = n.getAttribute('role'); const l = n.getAttribute('aria-live'); if (r === 'alert' || r === 'status' || r === 'log' || (l && l !== 'off')) return (r || '') + '/' + (l || '') + '#' + (n.id || n.className.toString().slice(0, 30)); } return null; };
  new MutationObserver(ms => { for (const m of ms) { const tg = m.target.nodeType === 1 ? m.target : m.target.parentElement; const lv = tg && isLive(tg); if (lv) window.__liv.push(lv + ' :: ' + (tg.innerText || tg.textContent || '').trim().slice(0, 100)); for (const a of m.addedNodes) { if (a.nodeType === 1) { const l2 = isLive(a); if (l2) window.__liv.push('added ' + l2 + ' :: ' + a.innerText.trim().slice(0, 100)); } } } }).observe(document.body, { subtree: true, childList: true, characterData: true });
  window.__liveBefore = [...document.querySelectorAll('[role=alert],[role=status],[aria-live]')].map(e => (e.getAttribute('role') || '') + '/' + (e.getAttribute('aria-live') || '') + ' empty=' + !e.innerText.trim()); });
R.liveBefore = await page.evaluate(() => window.__liveBefore);
const reqs = []; page.on('request', r => { if (/\/records/.test(r.url()) && r.method() !== 'GET') reqs.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
R.reqs = reqs;
R.a = await page.evaluate(() => { const w = document.querySelector('[data-rule-field="qa_rt18v_text"]'); const i = w && w.querySelector('input'); const db = i && i.getAttribute('aria-describedby'); const ids = (db || '').split(/\s+/).filter(Boolean);
  const msgEl = [...w.querySelectorAll('*')].find(e => /cannot start with BAD/i.test(e.textContent) && !e.children.length);
  const anc = []; for (let n = msgEl; n && n !== document.body; n = n.parentElement) { const r = n.getAttribute('role'), l = n.getAttribute('aria-live'); if (r || l) anc.push(n.tagName + ' role=' + r + ' live=' + l); }
  return { fieldText: w.innerText.replace(/\s+/g, ' ').slice(0, 120), ariaInvalid: i.getAttribute('aria-invalid'), describedby: db, describedTexts: ids.map(id => { const e = document.getElementById(id); return e ? id.slice(0, 30) + ' => ' + e.innerText.trim().slice(0, 80) + ' [role=' + e.getAttribute('role') + ' live=' + e.getAttribute('aria-live') + ']' : id + ' => MISSING'; }),
   msgTag: msgEl && (msgEl.tagName + ' id=' + msgEl.id + ' role=' + msgEl.getAttribute('role') + ' live=' + msgEl.getAttribute('aria-live')), msgLiveAncestors: anc,
   allLive: [...document.querySelectorAll('[role=alert],[role=status],[aria-live]')].map(e => (e.getAttribute('role') || '') + '/' + (e.getAttribute('aria-live') || '') + ': ' + e.innerText.trim().replace(/\s+/g,' ').slice(0, 100)).filter(s => !/: $/.test(s)),
   focusedField: (document.activeElement.closest('[data-rule-field]') || { getAttribute: () => null }).getAttribute('data-rule-field'), focusedTag: document.activeElement.tagName, focusedIsInput: document.activeElement === i, liveMutations: window.__liv.slice(0, 20) }; });
R.outer = await page.evaluate(() => document.querySelector('[data-rule-field="qa_rt18v_text"]').outerHTML.replace(/\s+/g,' ').slice(0, 900));
R.alertsByRole = await page.getByRole('alert').allInnerTexts().catch(e => 'err ' + e.message);
R.statusByRole = await page.getByRole('status').allInnerTexts().catch(e => 'err ' + e.message);
R.inputByRole = await page.getByRole('textbox', { description: /cannot start with BAD/i }).count().catch(e => 'err ' + e.message);
R.aria = await page.locator('[data-rule-field="qa_rt18v_text"]').ariaSnapshot().catch(e => 'err ' + e.message);
try { R.axFocused = await page.accessibility.snapshot({ interestingOnly: true, root: await t.elementHandle() }); } catch (e) { R.axFocused = 'err ' + e.message.slice(0, 100); }
R.box = await page.locator('[data-rule-field="qa_rt18v_text"]').boundingBox();
await shot('3018-1-crm-refused.png'); await page.evaluate(()=>window.scrollTo(0,0)); await page.getByRole('alert').first().scrollIntoViewIfNeeded().catch(()=>{}); await sleep(500); R.bannerBox = await page.getByRole('alert').first().boundingBox(); await shot('3018-2-crm-banner.png');
// highlight with a focus ring on screen for the image
return R;
