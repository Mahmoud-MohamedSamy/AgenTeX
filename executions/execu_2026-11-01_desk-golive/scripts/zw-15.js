async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.locator('[data-title="Save draft"]').first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(4000);
  await page.screenshot({ path: S + 'z-c2-draft-saved.png' });
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(12000);
  o.draftShown = /QA GL W2 zoho reply draft text|Draft/i.test(await page.innerText('body'));
  // open the comment editor
  await page.keyboard.press('Shift+C'); await sleep(4000);
  const c = page.locator('[data-title^="Comment"]').first(); if (!(await page.locator('text=/Comment as/i').count())) { if (await c.count()) { await c.click().catch(() => {}); await sleep(4000); } }
  let ed = []; for (const f of page.frames()) { const t = await f.$$eval('[contenteditable=true]', es => es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim().slice(0, 120))).catch(() => []); ed = ed.concat(t); }
  o.editors = ed; o.commentHasDraft = ed.some(t => /QA GL W2 zoho reply draft text/.test(t));
  await page.screenshot({ path: S + 'z-c2-comment-editor.png' });
  return o; }
