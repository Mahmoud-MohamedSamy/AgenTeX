async (page) => { const R = {};
  R.btns = await page.evaluate(() => { const m = document.querySelector('main') || document.body; return [...m.querySelectorAll('button,select')].filter(e => e.getBoundingClientRect().height > 0).map(e => e.tagName + '|' + (e.getAttribute('aria-haspopup') || '') + '|' + (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40)); });
  return R; }
