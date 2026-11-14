async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  await page.locator('[data-title="QA SK12 A6 QASK12RR QASK12S3x"]').first().click().catch(e => o.e0 = e.message.slice(0, 60)); await sleep(8000);
  await page.locator('[data-title="More Actions (M)"]').first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(2500);
  o.moreClosed = await page.$$eval('li', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(t => t && t.length < 40))].slice(0, 30));
  await page.screenshot({ path: S + 'z-more-closed-ticket.png' }); await page.keyboard.press('Escape'); await sleep(1000);
  // Snippets in setup
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/snippets', { waitUntil: 'domcontentloaded' }).catch(() => {}); await sleep(10000);
  o.snUrl = page.url(); o.snippets = ((await flat()).match(/Snippets.{0,500}/) || [''])[0]; await page.screenshot({ path: S + 'z-snippets.png' });
  return o; }
