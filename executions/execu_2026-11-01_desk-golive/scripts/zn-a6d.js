async (page) => { const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  await page.screenshot({ path: D + 'zoho-now.png' }); const fr = page.frames().map(f => f.url().slice(0, 120));
  return { url: page.url(), frames: fr, t: (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300) }; }
