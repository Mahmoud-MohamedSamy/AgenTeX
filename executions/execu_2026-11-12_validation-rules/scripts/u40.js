async (page) => {
  // H5 on Desk: layout rule shows + requires qa_vr_email when pick = Reject; validation rule checks the email domain
  const X = globalThis.__IDS; const R = {};
  try {
    await openCreate(X.mid, X.lid);
    R.before = { visible: await vis('qa_vr_email'), required: await isReq('qa_vr_email') };
    await pick('qa_vr_pick', 'Reject'); await sleep(1200);
    R.afterReject = { visible: await vis('qa_vr_email'), required: await isReq('qa_vr_email') };
    await save(); await sleep(1500);
    R.emptyMsg = (await wrap('qa_vr_email').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160);
    await typeIn('qa_vr_email', 'x@gmail.com'); await save(); await sleep(1500);
    R.badMsg = (await wrap('qa_vr_email').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160);
    await page.screenshot({ path: EV + 'desk-H5-both.png' });
  } catch (e) { R.err = String(e.message).slice(0, 250); }
  return R;
}
