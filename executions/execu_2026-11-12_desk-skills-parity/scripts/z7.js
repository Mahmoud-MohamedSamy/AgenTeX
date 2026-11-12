async (page) => { const t = await page.innerText('body'); const i = t.indexOf('Time Tracking'); const j = t.indexOf('AUTOMATION');
 const m = t.indexOf('PERSONALIZATION'); 
 // main content usually after the nav list end
 return { len: t.length, head: t.slice(0, 1200) }; }
