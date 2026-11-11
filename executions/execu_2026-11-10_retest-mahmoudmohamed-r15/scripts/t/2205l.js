for (const [id,n] of [['76c9b940-4734-4305-8277-f98956666ae7','2205-ticket-form'],['1f8e6e33-174e-4065-872c-9e2f82f70d2d','2205-ticket-edited']]) {
 await page.goto(H + '/views/all/tickets/'+id, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2205/.test(await text())) break; } await sleep(3000);
 await shot(n+'.png');
 const h = page.getByRole('tab', {name:/History/i}); if (await h.count()) { await h.first().click(); await sleep(4000); await shot(n+'-history.png'); }
}
