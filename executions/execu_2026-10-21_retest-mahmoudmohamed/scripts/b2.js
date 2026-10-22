// inspect form controls near Pipeline
const info = await page.evaluate(() => { const lab = [...document.querySelectorAll('label, span, div')].find(e => e.textContent.trim() === '*Pipeline' || e.textContent.trim() === 'Pipeline'); if (!lab) return 'nolabel'; let p = lab; for (let i=0;i<4;i++) p = p.parentElement; return p.outerHTML.slice(0, 2500); });
return done({ info });
