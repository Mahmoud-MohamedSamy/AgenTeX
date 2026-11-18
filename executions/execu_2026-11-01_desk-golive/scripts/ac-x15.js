const R7 = '229c89f5-9ae1-4edc-8d10-325936959fc5', CES = '1adfefb7-0c25-4484-ae92-782964695054';
const cs = D((await api('GET', '/desk/departments/' + DEP.CS)).j); out.before = cs.team_assignment_enabled;
let p = await api('PATCH', '/desk/departments/' + DEP.CS, { team_assignment_enabled: false }); out.off = p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 150) : '');
if (p.s >= 300) { p = await api('PUT', '/desk/departments/' + DEP.CS + '/team-assignment', { enabled: false }); out.off2 = p.s + ' ' + p.t.slice(0, 150); }
out.now = D((await api('GET', '/desk/departments/' + DEP.CS)).j).team_assignment_enabled;
out.assignTeam = await prr('POST', '/desk/tickets/' + R7 + '/assign', { owner_id: null, team_id: CES });
await go('/views/all/tickets/' + R7, 9000); const ob = page.getByRole('button', { name: /Owner|Assign/ }).first(); await ob.click().catch(() => {}); await sleep(2000); out.picker = (await page.locator('[role=dialog],[role=listbox],[role=menu],[data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot('access/o-teamoff-picker'); await page.keyboard.press('Escape');
const back = await api('PATCH', '/desk/departments/' + DEP.CS, { team_assignment_enabled: true }); out.restore = back.s; out.final = D((await api('GET', '/desk/departments/' + DEP.CS)).j).team_assignment_enabled;
return fin({ out });
