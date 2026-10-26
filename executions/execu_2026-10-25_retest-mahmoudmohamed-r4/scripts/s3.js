const u = /unsaved/i.test(await txt()); if (u) { await page.getByRole('button', { name: 'Discard' }).click(); await sleep(800); } return done({ hadUnsaved: u, now: /unsaved/i.test(await txt()) });
