async (page) => {
  const MID = '88e8ea44-1658-4df3-9930-d0902b91073d', LID = '40dced31-ff6e-4128-87c1-ffe95332389e'; const R = {};
  await openCreate(MID, LID); await typeIn('subject', 'QA VR1112 ui X3'); await pick('status', 'Open'); await pick('qa_vr_pick', 'Reject'); await save();
  R.blocked = page.url().includes('/new'); R.msg = (await wrap('qa_vr_ml').innerText()).replace(/\s+/g, ' '); await shot('desk-X3-blocked', false);
  await typeIn('qa_vr_ml', 'Customer cancelled the request'); await save();
  R.savedUrl = page.url().replace(HOST, ''); R.saved = !page.url().includes('/new');
  R.left = (await page.evaluate(() => [...document.querySelectorAll('[data-rule-field]')].map(w => w.innerText.replace(/\s+/g, ' ')).filter(t => /required|must|cannot|rejection/i.test(t)))).slice(0, 5);
  await shot('desk-X3-saved', false);
  return R;
}
