const ar = ('تجربة اختبار QA GL W4R تعليق طويل باللغة العربية للتحقق من الحفظ الكامل والاتجاه من اليمين إلى اليسار. ').repeat(8);
const rr = arr(D((await api('GET', '/desk/happiness/ratings?limit=50')).j)).find(x => x.ticket_number == 3940); out.saved76 = rr && { r: rr.rating, len: String(rr.feedback || '').length, trimmedSame: String(rr.feedback).trim() === ar.trim() };
// W4-77: restore baseline (off)
const base = { is_enabled: false, department_scope_enabled: false, department_ids: ['19510fdc-91f3-4a7a-8888-153f1318b765', '2a73bbc0-efb3-4250-bf9b-2fdc98236794', '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'] };
const cur = D((await api('GET', '/desk/happiness/settings')).j);
const p = await api('PUT', '/desk/happiness/settings', { ...cur, ...base }, { 'if-match': String(cur.row_version) }); out.off = p.s;
const f = D((await api('GET', '/desk/happiness/settings')).j); out.restored = f.is_enabled === false && f.department_scope_enabled === false && JSON.stringify(f.department_ids) === JSON.stringify(base.department_ids);
const L77 = 'https://staging-desk.taviportal.com/happiness/dh1.a7a7a7a7000000000000000000000004.W1VBZtqXslnxu3D7I3Hbo4vGEeuHi89Qg3PInjd42nE';
const p2 = await page.context().newPage(); await p2.goto(L77 + '?rating=bad', { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(5000);
out.page77 = (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); await p2.screenshot({ path: SHOT + '/w4/W4-77-off.png' });
const sub = p2.getByRole('button', { name: /^Submit/ }); if (await sub.count()) { await p2.getByRole('button', { name: /bad/i }).first().click().catch(() => {}); await sub.click().catch(() => {}); await p2.waitForTimeout(4000); out.after77 = (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); }
await p2.close();
out.saved77 = arr(D((await api('GET', '/desk/happiness/ratings?limit=50')).j)).filter(x => x.ticket_number == 3942).map(x => x.rating);
return fin({ out });
