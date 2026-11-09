await page.locator('main button:has-text("Actions"), main [role=tab]:has-text("Actions")').first().click().catch(() => {}); await sleep(3000);
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
out.actions = t.match(/Action Endpoint.{0,2500}/)?.[0];
out.flightHits = (t.match(/[^.]{0,60}(flight|booking|Flight|Booking)[^.]{0,60}/g) || []).slice(0, 10);
await page.screenshot({ path: RAW + 'custom-actions-list.png' });
