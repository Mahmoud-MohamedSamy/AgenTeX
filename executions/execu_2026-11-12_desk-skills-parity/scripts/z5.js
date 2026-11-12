async (page) => { const t = await page.innerText('body').catch(()=>''); const i=t.indexOf('Skill'); return t.slice(Math.max(0,i-200), i+2500); }
