async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.getByText('Preferences', { exact: true }).first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(8000);
  o.url = page.url(); let t = ''; for (const f of page.frames()) t += ' ' + (await f.innerText('body').catch(() => ''));
  o.sig = t.replace(/\s+/g, ' ').match(/Signature.{0,500}/)?.[0];
  await page.screenshot({ path: S + 'z-preferences.png' }); return o; }
