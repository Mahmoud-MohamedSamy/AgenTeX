const routes = ["/settings/data/sandboxes","/settings/data/archive","/settings/security/audit-log","/settings/integrations/collaboration","/settings/integration-config","/settings/integrations/crm","/settings/integrations/desk","/settings/integrations"]; const out = [];
for (const u of routes) { const o = { u };
  try { await page.goto(H + u, { waitUntil: 'domcontentloaded', timeout: 45000 }); await sleep(4500);
    const t = await txt(); o.final = page.url().replace(H, ''); o.len = t.length;
    o.flags = (t.match(/coming soon|in development|not available yet|under construction|something went wrong|page not found|404|no permission|access denied|failed to load|could not be loaded|error/gi) || []).slice(0, 6);
    o.text = t.replace(/\s+/g, ' ').slice(0, 1500);
    o.shot = await shot('../tour/' + u.replace(/[^a-z0-9]+/gi, '_').slice(0, 60));
  } catch (e) { o.err = String(e.message).slice(0, 120); }
  out.push(o); }
return done(out);
