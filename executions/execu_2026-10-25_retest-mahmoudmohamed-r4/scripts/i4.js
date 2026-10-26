const C = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
await page.goto(H + `/modules/${C}`, { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 60; k++) { await sleep(1000); if (/\d+ records|Contacts/.test(await txt().catch(() => ''))) break; } await sleep(3000);
const t = await txt(); const raw = (t.match(/\b(synced|needs_attention|unlinked)\b/g) || []); const nice = (t.match(/\b(Synced|Needs attention|Unlinked)\b/g) || []);
await shot('2400-01-contact-list');
return done({ url: page.url().replace(H, ''), raw: raw.length, nice: [...new Set(nice)], niceCount: nice.length });
