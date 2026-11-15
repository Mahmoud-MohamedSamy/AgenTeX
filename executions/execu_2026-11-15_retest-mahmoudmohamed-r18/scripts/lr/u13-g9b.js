const R = { net: [] };
await openRec(DM, I.dealRec);
page.on('response', r => { const m = r.request().method(); if (m !== 'GET' && /api\/v1/.test(r.url())) R.net.push(m + ' ' + r.url().split('/api/v1')[1].slice(0, 90) + ' ' + r.status()); });
const nb = page.getByRole('button', { name: /^Negotiation/ }).first();
await nb.click(); await sleep(900); await shot('2976-1-click-negotiation.png');
R.dlg = await page.locator('[role=dialog],[role=alertdialog]').count(); if (R.dlg) { const d = page.locator('[role=dialog],[role=alertdialog]').first(); R.dlgTxt = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); R.bDlg = await box(d); }
R.toastTxt = await page.locator('[data-sonner-toast], [role=status], [role=alert]').allInnerTexts().catch(() => []); R.bToast = await box(page.locator('[data-sonner-toast]').first());
await sleep(4000); R.dlg2 = await page.locator('[role=dialog],[role=alertdialog]').count(); await shot('2976-2-after.png');
R.stageCur = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(e => /Qualification|Negotiation/.test(e.innerText)); return b.map(e => e.innerText.trim() + ':' + (e.getAttribute('aria-current') || e.getAttribute('aria-pressed') || e.className.match(/bg-[a-z]+-\d+/)?.[0] || '')); });
return R;
