await page.waitForTimeout(8000); out.url = page.url();
out.me = (await api(page, 'GET', 'myinfo')).j; out.me = out.me && { id: out.me.id, name: out.me.name || out.me.firstName, role: out.me.roleId, prof: out.me.profileId };
out.depts = ((await api(page, 'GET', 'departments?limit=20')).j?.data || []).map(d => d.name + '|' + d.id + '|' + d.isEnabled);
