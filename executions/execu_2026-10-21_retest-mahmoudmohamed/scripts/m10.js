const info = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Full Name'); let p = el; for (let i = 0; i < 4; i++) p = p.parentElement; return p.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/class="[^"]*"/g, '').slice(0, 2500); });
return done({ info });
