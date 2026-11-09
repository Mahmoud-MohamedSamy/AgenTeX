(async (page, frame, ctx) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const U = page.url(); const o = {};
  const openEdit = async pg => { await pg.goto(U, { waitUntil: 'domcontentloaded', timeout: 90000 }); await pg.waitForTimeout(25000); await pg.getByText('Not Now', { exact: true }).click().catch(() => {}); await pg.mouse.click(568, 146); await pg.waitForTimeout(4000); };
  const pb = await ctx.newPage(); await pb.setViewportSize({ width: 1600, height: 900 });
  await openEdit(page); await openEdit(pb);
  await page.bringToFront(); await page.screenshot({ path: R + 'zoho-B2-1-tabA-open.png' });
  await page.mouse.click(803, 435); await page.waitForTimeout(1500); await page.screenshot({ path: R + 'zoho-B2-2-tabA-alert.png' });
  await page.mouse.click(645, 402); await page.waitForTimeout(1500); await page.mouse.click(677, 491); await page.waitForTimeout(5000);
  await page.screenshot({ path: R + 'zoho-B2-3-tabA-saved.png' });
  await pb.bringToFront(); await pb.screenshot({ path: R + 'zoho-B2-4-tabB-stale.png' });
  await pb.mouse.click(790, 355); await pb.keyboard.type('QA GL tab B'); await pb.waitForTimeout(600); await pb.mouse.click(677, 491); await pb.waitForTimeout(6000);
  await pb.screenshot({ path: R + 'zoho-B2-5-tabB-saved.png' });
  o.bMsg = (await pb.innerText('body')).replace(/\s+/g, ' ').match(/.{0,80}(updated|success|modified|changed|conflict|refresh|another|latest)[^.]{0,100}/ig);
  await openEdit(page); await page.screenshot({ path: R + 'zoho-B2-6-reload.png' }); await pb.close();
  return o; })
