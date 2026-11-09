async (page) => { const o = []; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/__OUT__';
  for (let i = 1; i <= __N__; i++) { await page.mouse.move(900, 500); await page.mouse.wheel(0, 650); await page.waitForTimeout(1500); await page.screenshot({ path: D + '-s' + i + '.png' }); o.push(i); }
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  const t = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' '); return { n: o.length, act: t.match(/Actions?.{0,600}$/)?.[0]?.slice(0, 700) }; }
