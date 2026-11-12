async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  const all = await d.evaluate(() => { const box = document.elementFromPoint(860, 330); let p = box; for (let i=0;i<8 && p;i++){ if (p.scrollHeight > p.clientHeight + 20) break; p = p.parentElement; } return p ? p.innerText : (box && box.innerText); });
  await d.mouse.click(940, 254); await d.keyboard.type('QA VR1112'); await d.waitForTimeout(1500);
  await d.mouse.click(900, 294); await d.waitForTimeout(1500);
  await d.getByText('Next', { exact: true }).first().click({ force: true }).catch(()=>d.mouse.click(455, 303));
  await d.waitForTimeout(4000);
  await d.screenshot({ path: ev + 'zoho-desk-vr-editor.png' });
  return { fields: all };
}
