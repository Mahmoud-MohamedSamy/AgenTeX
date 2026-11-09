async (page) => {
  const out = {};
  let fr = null; for (const f of page.frames()) { const t = await f.innerText('body').catch(() => ''); if (/SKILL TYPES/i.test(t) && /Add Skill/.test(t)) fr = f; }
  if (!fr) return { err: 'no frame' };
  const fe = await fr.frameElement(); const off = await fe.boundingBox(); out.off = off;
  await fr.getByText(/^skill types$/i).first().click({ timeout: 10000 }).catch(e => out.err = e.message.slice(0, 100));
  for (let i = 0; i < 15; i++) { await page.waitForTimeout(2000); if (/Add Skill Type/.test(await fr.innerText('body').catch(() => ''))) break; }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-06_desk-assignment-skills/screenshots/zoho-skill-types-2026-11-08.png' });
  const bb = async (re) => { const l = fr.getByText(re); const n = await l.count(); const o = []; for (let i = 0; i < n; i++) { const b = await l.nth(i).boundingBox(); if (b) o.push(b); } return o; };
  out.dept = await bb(/^Haytham Mohamed$/); out.tab = await bb(/^skill types$/i); out.add = await bb(/^Add Skill Type$/); out.hdr = await bb(/^Skills$/); out.empty = await bb(/No skill types yet/);
  out.hash = page.url().split('#')[1];
  return out;
}
