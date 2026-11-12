async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.waitForTimeout(5000);
  await d.screenshot({ path: ev + 'zoho-desk-vr-editor.png' });
  const t = await d.innerText('body'); const i = t.indexOf('Create Validation Rule');
  const s = t.slice(i, i + 1200);
  // open the condition/operator dropdown text if visible
  return { s };
}
