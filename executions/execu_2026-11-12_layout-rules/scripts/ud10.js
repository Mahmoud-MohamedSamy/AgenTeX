async (page) => {
  const mid = '88e8ea44-1658-4df3-9930-d0902b91073d';
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/ids-desk.json', 'utf8'));
  const R = {};
  await openRec(mid, ids.G16hr); R.hr_view_has_date = (await bodyText()).includes('QA LR1112 date'); await shot('desk-G16-view-hr');
  await openRec(mid, ids.G16cs); R.cs_view_has_date = (await bodyText()).includes('QA LR1112 date');
  return R;
}
