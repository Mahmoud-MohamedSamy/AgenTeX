// G05: Arabic audit of the main screens as test user 2 (language already switched to Arabic in this browser).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
// a record test user 2 can open: newest lead in the list
const lr = await api('GET', `/modules/${L}/records?page=1&per_page=5&sort_by=created_at&sort_dir=desc`);
const rec = lr.j && lr.j.data && lr.j.data[0] && lr.j.data[0].id;
out.record = rec;
const screens = [['home', '/'], ['leads-list', '/modules/' + L], ['deals-list', '/modules/' + D], ['record', '/modules/' + L + '/records/' + rec], ['create', '/modules/' + L + '/records/new'],
  ['setup', '/settings'], ['reports', '/reports'], ['dashboards', '/dashboards'], ['workqueue', '/workqueue'], ['calendar', '/calendar'], ['locale-page', '/settings/personal/locale']];
out.s = [];
for (const [n, r] of screens) {
  await page.goto(B + r, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 60; i++) { await sleep(1000); const t = await page.evaluate(() => (document.querySelector('main') || document.body).innerText); if (t.length > 80 && !/Loading|جارٍ التحميل|جار التحميل|جاري التحميل/.test(t.slice(0, 200))) break; }
  await sleep(2500);
  const a = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
    const sel = 'button, th, label, h1, h2, h3, h4, [role=tab], [role=menuitem], nav a, aside a, [role=columnheader], option, legend, .badge, span[title]';
    const eng = new Set();
    for (const e of document.querySelectorAll(sel)) { if (!vis(e)) continue; const t = (e.innerText || '').trim(); if (t && /[A-Za-z]{3,}/.test(t) && t.length < 60) eng.add(t.replace(/\s+/g, ' ')); }
    for (const e of document.querySelectorAll('input[placeholder], textarea[placeholder]')) { const p = e.getAttribute('placeholder'); if (vis(e) && /[A-Za-z]{3,}/.test(p)) eng.add('placeholder: ' + p); }
    for (const e of document.querySelectorAll('[aria-label]')) { const p = e.getAttribute('aria-label'); if (vis(e) && /^[^\u0600-\u06FF]*[A-Za-z]{3,}/.test(p) && !/[\u0600-\u06FF]/.test(p)) eng.add('aria: ' + p); }
    const clipped = [];
    for (const e of document.querySelectorAll('button, label, th, td, span, a, h1, h2, h3, p, div')) {
      if (!vis(e) || e.children.length > 0) continue; const t = (e.innerText || '').trim(); if (!t) continue;
      const cs = getComputedStyle(e); if (e.scrollWidth > e.clientWidth + 2 && cs.overflow !== 'visible' && cs.textOverflow !== 'ellipsis') clipped.push(t.slice(0, 40));
    }
    const nav = document.querySelector('aside, nav'); const nr = nav && nav.getBoundingClientRect();
    const txt = document.body.innerText;
    return { dir: document.documentElement.dir, lang: document.documentElement.lang, navSide: nr ? (nr.left > innerWidth / 2 ? 'right' : 'left') : '?', navLeft: nr && Math.round(nr.left),
      english: [...eng].slice(0, 40), englishCount: eng.size, clipped: [...new Set(clipped)].slice(0, 15),
      latinDigits: (txt.match(/\d+/g) || []).length, arabicDigits: (txt.match(/[\u0660-\u0669]+/g) || []).length,
      dates: (txt.match(/[\d\u0660-\u0669]{1,4}[\/\-.][\d\u0660-\u0669]{1,2}[\/\-.][\d\u0660-\u0669]{2,4}/g) || []).slice(0, 5),
      sample: (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 300) };
  });
  out.s.push({ n, ...a });
  await page.screenshot({ path: RAW + 'ar-' + n + '.png' });
}
