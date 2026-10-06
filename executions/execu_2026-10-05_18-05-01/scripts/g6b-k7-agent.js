// K7 step 2 (agent): own setting and Organize Tabs unaffected by the admin's change.
const r = await api('GET', '/settings/resolved?app_key=general&key=general.user.desk.nav_tabs&scope_type=User');
await go('/settings/organize-tabs', 6000); const t = await txt(); const sel = (t.split('Selected modules')[1] || '').split('Unselected modules')[0];
rec('K7', /Social/.test(sel) ? 'PASS' : 'FAIL', `admin hid Social; agent's own setting ${r.j && r.j.data && r.j.data.value_json} (resolved_from ${r.j && r.j.data && r.j.data.resolved_from}); Social still in the agent's Selected modules=${/Social/.test(sel)} — confirms the arrangement is per user (Zoho: set by the admin for everyone, gap Z8)`);
return done();
