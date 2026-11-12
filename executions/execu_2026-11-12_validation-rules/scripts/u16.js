async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LID = '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'; const R = {};
  await openCreate(MID, LID); await typeIn('first_name', 'QA VR1112 ui H4'); await typeIn('qa_vr_phone', '+201001234567');
  R.textVisibleAtStart = await vis('qa_vr_text');
  await pick('qa_vr_pick', 'Open'); R.visOpen = await vis('qa_vr_text');
  await typeIn('qa_vr_text', 'BAD-hidden');
  await pick('qa_vr_pick', 'Done'); R.visDone = await vis('qa_vr_text');
  await save(); R.saved = !page.url().includes('/new'); R.url = page.url().replace(HOST, '');
  R.msgs = (await bodyText()).match(/.{0,40}QA R1 text cannot start with BAD.{0,40}/g);
  await shot('crm-H4-hidden', false);
  return R;
}
