async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  for (const name of ['Preferences', 'My Profile']) { await page.getByText(name, { exact: true }).first().click().catch(e => o['e' + name] = String(e).slice(0, 80)); await page.waitForTimeout(9000);
    const t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); o[name] = [page.url(), (t.match(/.{0,200}signature.{0,300}/i) || [''])[0]];
    if (/signature/i.test(t)) { const s = page.getByText(/signature/i).first(); await s.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1500); await page.screenshot({ path: S + 'zi-sig-' + name.replace(' ', '') + '.png' }); } }
  return o; }
