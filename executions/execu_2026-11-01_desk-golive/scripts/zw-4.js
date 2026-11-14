async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  const esc = async () => { await page.keyboard.press('Escape'); await sleep(1200); };
  // More actions on an Open ticket
  await page.locator('[data-title="More Actions (M)"]').first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(2500);
  o.moreMenu = await page.$$eval('li, [role=menuitem]', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(t => t && t.length < 40))].slice(0, 40));
  await page.screenshot({ path: S + 'z-more-open-ticket.png' }); await esc();
  // Share Ticket panel
  await page.locator('[data-title="Share Ticket"]').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(4000);
  o.share = ((await flat()).match(/Share (Ticket|this ticket).{0,700}/i) || [''])[0]; await page.screenshot({ path: S + 'z-share-panel.png' });
  return o; }
