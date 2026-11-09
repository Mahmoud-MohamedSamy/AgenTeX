const o = {};
o.res = await page.evaluate(() => { const keep = ['Open', 'On Hold', 'Escalated', 'Closed', 'QA NDC Pending'];
  const h = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Statuses by department and layout'); if (!h) return 'no header';
  const hy = h.getBoundingClientRect().top + window.scrollY; let un = 0, kept = [];
  for (const cb of document.querySelectorAll('input[type=checkbox]')) { const y = cb.getBoundingClientRect().top + window.scrollY; if (y < hy) continue;
    let row = cb.parentElement; for (let k = 0; k < 4 && row && !/OPEN|ON HOLD|CLOSED/.test(row.innerText); k++) row = row.parentElement;
    const name = row ? row.innerText.split('\n')[0].trim() : ''; if (!name || /Fall back/.test(name)) continue;
    if (!keep.includes(name) && cb.checked) { cb.click(); un++; } else if (cb.checked) kept.push(name); }
  return { un, kept }; });
await sleep(1000); o.shot = await shot('rt/2797-picked');
return JSON.stringify(o);
