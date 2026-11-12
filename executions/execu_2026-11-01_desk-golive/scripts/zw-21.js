async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); await sleep(6000);
  let t = ''; for (const f of page.frames()) t += ' ' + (await f.innerText('body').catch(() => ''));
  t = t.replace(/\s+/g, ' '); o.sig = t.match(/.{0,80}Signature.{0,400}/)?.[0]; o.len = t.length;
  await page.screenshot({ path: S + 'z-myprofile.png' }); return o; }
