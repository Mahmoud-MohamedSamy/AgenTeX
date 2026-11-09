const routes = __ROUTES__; const out = [];
for (const u of routes) { const o = { u };
  try { await page.goto(H + u, { waitUntil: 'commit', timeout: 40000 });
    let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt().catch(() => ''); if (t.length > 450 && !/Loading…\s*$/.test(t)) break; }
    await sleep(1500); t = await txt().catch(() => '');
    o.final = page.url().replace(H, ''); if (/^Sign in/.test(t.trim())) { o.err = 'SIGNED_OUT'; out.push(o); break; } o.len = t.length;
    o.flags = (t.match(/coming soon|in development|not available yet|something went wrong|page not found|no permission|access denied|failed to load|could not be loaded|error/gi) || []).slice(0, 6);
    const i0 = t.indexOf('Set up your Desk'); o.text = t.replace(/\s+/g, ' ').slice(0, 2500);
    o.shot = await shot('../tour/' + u.replace(/[^a-z0-9]+/gi, '_').slice(0, 60));
  } catch (e) { o.err = String(e.message).slice(0, 120); }
  out.push(o); }
return done(out);
