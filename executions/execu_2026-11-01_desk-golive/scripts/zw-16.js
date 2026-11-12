async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.mouse.click(1480, 80); await sleep(5000);
  let ed = []; for (const f of page.frames()) { const t = await f.$$eval('[contenteditable=true]', es => es.filter(e => e.offsetParent !== null || e.tagName === 'BODY').map(e => e.innerText.trim().slice(0, 120))).catch(() => []); ed = ed.concat(t); }
  o.editors = ed; o.commentHasDraft = ed.some(t => /reply draft text/.test(t));
  o.ui = (await page.innerText('body')).replace(/\s+/g, ' ').match(/(Comment as|Private|Public).{0,80}/)?.[0];
  await page.screenshot({ path: S + 'z-c2-comment-editor.png' }); return o; }
