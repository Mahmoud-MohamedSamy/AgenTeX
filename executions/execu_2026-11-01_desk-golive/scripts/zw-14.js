async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.locator('button', { hasText: /^Reply All$/ }).first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(5000);
  // type into the reply editor (iframe or contenteditable)
  let typed = false;
  for (const f of page.frames()) { const ed = f.locator('[contenteditable=true], body[contenteditable=true]').first(); if (await ed.count().catch(() => 0)) { await ed.click().catch(() => {}); await page.keyboard.type('QA GL W2 zoho reply draft text', { delay: 25 }); typed = true; break; } }
  o.typed = typed; await sleep(1500); await page.screenshot({ path: S + 'z-c2-reply-typed.png' });
  o.btns = await page.$$eval('button, [role=button]', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => (b.innerText || b.getAttribute('data-title') || '').trim()).filter(Boolean))].slice(-25));
  o.titles = await page.$$eval('[data-title]', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.getAttribute('data-title')))].filter(t => /draft|save|send|close|discard|minimi/i.test(t)));
  return o; }
