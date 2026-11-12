async (page) => { const R = {}; R.url = page.url(); const t = await bodyText(); R.b9 = (t.match(/Could not load[^.]*\./) || [''])[0];
  R.el = await page.evaluate(() => { const l = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && (e.textContent || '').trim() === 'Apply to Help Center'); if (!l) return 'none'; let x = l; for (let k = 0; k < 4; k++) { x = x.parentElement; const s = x.querySelector('button[role=switch],input[type=checkbox]'); if (s) return s.outerHTML.slice(0, 300); } return l.parentElement.outerHTML.slice(0, 300); });
  return R; }
