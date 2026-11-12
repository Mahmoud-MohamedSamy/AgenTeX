async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await openCreate(mid, lid); await pick('qa_lr_type', 'Question'); await shot('crm-G6-createQ');
  return page.evaluate(() => [...document.querySelectorAll('*')].filter(e => /Sec [AB]/.test(e.textContent || '') && e.childElementCount < 2).map(e => e.tagName + ':' + e.textContent.trim().slice(0, 40) + ':' + Math.round(e.getBoundingClientRect().height)).slice(0, 10)); }
