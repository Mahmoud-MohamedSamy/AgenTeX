(async (page, frame, ctx) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const U = page.url(); const o = {};
  const pb = await ctx.newPage(); await pb.setViewportSize({ width: 1600, height: 900 }); await pb.goto(U, { waitUntil: 'domcontentloaded', timeout: 90000 }); await pb.waitForTimeout(25000);
  await pb.getByText('Not Now', { exact: true }).click().catch(() => {}); await pb.mouse.click(568, 146); await pb.waitForTimeout(4000);
  await pb.screenshot({ path: R + 'zoho-B2-1-tabB-open.png' });
  // tab A: turn Display in Help Center off and save
  await page.bringToFront(); await page.mouse.click(803, 435); await page.waitForTimeout(800); await page.screenshot({ path: R + 'zoho-B2-2-tabA-toggle-off.png' });
  await page.mouse.click(677, 491); await page.waitForTimeout(4000); await page.screenshot({ path: R + 'zoho-B2-3-tabA-saved.png' });
  o.aText = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,40}(updated|saved|success|unable)[^.]{0,60}/ig);
  // tab B stale: add description and save
  await pb.bringToFront(); await pb.mouse.click(790, 355); await pb.keyboard.type('QA GL tab B'); await pb.waitForTimeout(600); await pb.screenshot({ path: R + 'zoho-B2-4-tabB-stale-edit.png' });
  await pb.mouse.click(677, 491); await pb.waitForTimeout(5000); await pb.screenshot({ path: R + 'zoho-B2-5-tabB-saved.png' });
  o.bText = (await pb.innerText('body')).replace(/\s+/g, ' ').match(/.{0,60}(updated|saved|success|unable|modified|changed|conflict|refresh|another)[^.]{0,80}/ig);
  // reload A and open edit
  await page.bringToFront(); await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(25000); await page.getByText('Not Now', { exact: true }).click().catch(() => {}); await page.mouse.click(568, 146); await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'zoho-B2-6-reload.png' }); await pb.close();
  return o; })
