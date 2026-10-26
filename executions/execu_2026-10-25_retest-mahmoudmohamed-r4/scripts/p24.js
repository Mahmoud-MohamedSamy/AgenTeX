await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(500); return done({ ok: 1 });
