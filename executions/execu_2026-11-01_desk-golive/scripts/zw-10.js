async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  for (const [k, p] of [['ds', 'setup/datasharing'], ['ds2', 'setup/data-sharing'], ['roles', 'setup/roles']]) { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/' + p, { waitUntil: 'domcontentloaded' }).catch(() => {}); await sleep(10000);
    const fr = page.frames().map(f => f.url()).slice(0, 5); let t = ''; for (const f of page.frames()) { t += ' ' + (await f.innerText('body').catch(() => '')); } o[k] = { url: page.url(), text: t.replace(/\s+/g, ' ').replace(/^.*?(Data Sharing|Roles)/, '$1').slice(0, 600) }; await page.screenshot({ path: S + 'z-' + k + '.png' }); }
  return o; }
